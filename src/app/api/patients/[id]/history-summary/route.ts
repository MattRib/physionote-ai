import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { openai, GPT_MODEL } from '@/server/openai';

type SessionWithNote = {
  id: string;
  patientId: string;
  date: Date;
  durationMin: number | null;
  sessionType: string | null;
  specialty: string | null;
  motivation: string | null;
  audioUrl: string | null;
  audioSize: number | null;
  transcription: string | null;
  status: string;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
  note: {
    id: string;
    sessionId: string;
    contentJson: string;
    aiGenerated: boolean;
    aiModel: string | null;
    aiPromptUsed: string | null;
    reviewedBy: string | null;
    reviewedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

// GET - Buscar resumo existente
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const patientId = params.id;

    const summary = await prisma.historySummary.findUnique({
      where: { patientId },
    });

    if (!summary) {
      return NextResponse.json({ summary: null }, { status: 200 });
    }

    return NextResponse.json({
      summary: {
        id: summary.id,
        content: summary.content,
        isPinned: summary.isPinned,
        sessionsIds: JSON.parse(summary.sessionsIds),
        aiModel: summary.aiModel,
        createdAt: summary.createdAt.toISOString(),
        updatedAt: summary.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Erro ao buscar resumo:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar resumo do histórico' },
      { status: 500 }
    );
  }
}

// POST - Gerar novo resumo ou substituir existente
export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const patientId = params.id;

    // Buscar paciente e todas as sessões com notas
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        sessions: {
          where: {
            status: 'completed',
            note: {
              isNot: null,
            },
          },
          include: {
            note: true,
          },
          orderBy: {
            date: 'asc',
          },
        },
      },
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Paciente não encontrado' },
        { status: 404 }
      );
    }

    if (patient.sessions.length === 0) {
      return NextResponse.json(
        { error: 'Paciente não possui sessões com notas para resumir' },
        { status: 400 }
      );
    }

    // Preparar dados das sessões para o prompt
    const sessionsData = patient.sessions.map((session: SessionWithNote, index: number) => {
      const noteContent = session.note ? JSON.parse(session.note.contentJson) : {};
      const sessionDate = new Date(session.date).toLocaleDateString('pt-BR');

      return `
📅 SESSÃO ${index + 1} - ${sessionDate}
${session.sessionType ? `Tipo: ${session.sessionType}` : ''}
${session.specialty ? `Especialidade: ${session.specialty}` : ''}

${noteContent.resumoExecutivo?.queixaPrincipal ? `🎯 Queixa: ${noteContent.resumoExecutivo.queixaPrincipal}` : ''}
${noteContent.resumoExecutivo?.nivelDor ? `📊 Dor: ${noteContent.resumoExecutivo.nivelDor}/10` : ''}

${noteContent.diagnosticoFisioterapeutico?.principal ? `🔍 Diagnóstico: ${noteContent.diagnosticoFisioterapeutico.principal}` : ''}

${noteContent.intervencoes?.tecnicasManuais?.length ? `✋ Técnicas: ${noteContent.intervencoes.tecnicasManuais.join(', ')}` : ''}
${noteContent.intervencoes?.exerciciosTerapeuticos?.length ? `💪 Exercícios: ${noteContent.intervencoes.exerciciosTerapeuticos.join(', ')}` : ''}

${noteContent.respostaTratamento?.imediata ? `📈 Resposta: ${noteContent.respostaTratamento.imediata}` : ''}

${noteContent.planoTratamento?.objetivosCurtoPrazo?.length ? `🎯 Objetivos: ${noteContent.planoTratamento.objetivosCurtoPrazo.join(', ')}` : ''}
---
      `.trim();
    });

    // Criar prompt para a OpenAI
    const prompt = `Você é um fisioterapeuta especialista em análise de prontuários. Analise o histórico completo de atendimento do paciente abaixo e crie um resumo clínico estruturado e profissional.

**PACIENTE:** ${patient.name}
**TOTAL DE SESSÕES:** ${patient.sessions.length}
**PERÍODO:** ${new Date(patient.sessions[0].date).toLocaleDateString('pt-BR')} a ${new Date(patient.sessions[patient.sessions.length - 1].date).toLocaleDateString('pt-BR')}

═══════════════════════════════════════════════════════
HISTÓRICO DE SESSÕES
═══════════════════════════════════════════════════════

${sessionsData.join('\n\n')}

═══════════════════════════════════════════════════════

**INSTRUÇÕES PARA O RESUMO:**

Crie um resumo clínico profissional seguindo esta estrutura:

## 🎯 SÍNTESE CLÍNICA
- Quadro clínico inicial e evolução
- Diagnóstico fisioterapêutico principal
- Condições secundárias relevantes

## 📊 EVOLUÇÃO DO TRATAMENTO
- Progresso observado ao longo das sessões
- Mudanças nos níveis de dor e funcionalidade
- Marcos importantes alcançados

## 💊 INTERVENÇÕES APLICADAS
- Técnicas manuais mais utilizadas
- Exercícios terapêuticos prescritos
- Recursos complementares

## 📈 RESULTADOS ALCANÇADOS
- Melhoras objetivas e subjetivas
- Feedback do paciente
- Capacidades funcionais recuperadas

## 🎯 RECOMENDAÇÕES
- Continuidade do tratamento
- Exercícios domiciliares
- Precauções e orientações

---

**IMPORTANTE:**
- Use linguagem técnica mas clara
- Seja objetivo e direto
- Destaque informações clinicamente relevantes
- Mantenha a formatação Markdown com emojis
- Máximo de 800 palavras`;

    // Chamar OpenAI para gerar o resumo
    const completion = await openai.chat.completions.create({
      model: GPT_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'Você é um fisioterapeuta experiente especializado em análise de prontuários e síntese clínica. Sua função é criar resumos profissionais, concisos e clinicamente relevantes.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const summaryContent = completion.choices[0]?.message?.content || '';

    if (!summaryContent) {
      throw new Error('OpenAI não retornou conteúdo');
    }

    // Verificar se já existe resumo
    const existingSummary = await prisma.historySummary.findUnique({
      where: { patientId },
    });

    const sessionsIds = patient.sessions.map((s: SessionWithNote) => s.id);

    let summary;

    if (existingSummary) {
      // Atualizar resumo existente
      summary = await prisma.historySummary.update({
        where: { patientId },
        data: {
          content: summaryContent,
          aiModel: GPT_MODEL,
          sessionsIds: JSON.stringify(sessionsIds),
          updatedAt: new Date(),
        },
      });
    } else {
      // Criar novo resumo
      summary = await prisma.historySummary.create({
        data: {
          patientId,
          content: summaryContent,
          aiModel: GPT_MODEL,
          sessionsIds: JSON.stringify(sessionsIds),
          isPinned: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      summary: {
        id: summary.id,
        content: summary.content,
        isPinned: summary.isPinned,
        sessionsIds: JSON.parse(summary.sessionsIds),
        aiModel: summary.aiModel,
        createdAt: summary.createdAt.toISOString(),
        updatedAt: summary.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Erro ao gerar resumo:', error);
    return NextResponse.json(
      {
        error: 'Erro ao gerar resumo do histórico',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// PATCH - Fixar/Desfixar resumo ou editar conteúdo
export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const patientId = params.id;
    const body = await request.json();
    const { isPinned, content } = body;

    // Preparar dados para atualização
    const updateData: any = {};

    if (typeof isPinned === 'boolean') {
      updateData.isPinned = isPinned;
    }

    if (typeof content === 'string') {
      updateData.content = content;
      updateData.updatedAt = new Date();
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Nenhum campo válido para atualizar' },
        { status: 400 }
      );
    }

    const summary = await prisma.historySummary.update({
      where: { patientId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      summary: {
        id: summary.id,
        content: summary.content,
        isPinned: summary.isPinned,
        sessionsIds: JSON.parse(summary.sessionsIds),
        aiModel: summary.aiModel,
        createdAt: summary.createdAt.toISOString(),
        updatedAt: summary.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Erro ao atualizar resumo:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar status do resumo' },
      { status: 500 }
    );
  }
}

// DELETE - Remover resumo
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const patientId = params.id;

    await prisma.historySummary.delete({
      where: { patientId },
    });

    return NextResponse.json({
      success: true,
      message: 'Resumo removido com sucesso',
    });
  } catch (error: any) {
    console.error('Erro ao deletar resumo:', error);
    return NextResponse.json(
      { error: 'Erro ao remover resumo do histórico' },
      { status: 500 }
    );
  }
}
