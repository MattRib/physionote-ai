import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { medicalHistory, sessions } = await req.json();

    // Mock summarization: take first sentences and key bullets
    const hist = String(medicalHistory ?? '').trim();
    const firstSentence = hist.split(/\.(\s|$)/)[0]?.trim();

    const keyFindings: string[] = [];
    if (Array.isArray(sessions)) {
      const latest = sessions[0];
      if (latest?.resumoExecutivo?.queixaPrincipal) {
        keyFindings.push(`Queixa principal: ${latest.resumoExecutivo.queixaPrincipal}`);
      }
      if (latest?.resumoExecutivo?.nivelDor != null) {
        keyFindings.push(`Nível de dor atual: ${latest.resumoExecutivo.nivelDor}/10`);
      }
      if (latest?.diagnosticoFisioterapeutico?.principal) {
        keyFindings.push(`Diagnóstico: ${latest.diagnosticoFisioterapeutico.principal}`);
      }
    }

    const summary = [
      firstSentence ? `Resumo: ${firstSentence}.` : 'Resumo: Histórico clínico registrado.',
      keyFindings.length ? `\nPontos-chave:\n- ${keyFindings.join('\n- ')}` : '',
      '\nNota: Este resumo é gerado automaticamente e deve ser revisado por um profissional.'
    ].join('\n');

    return NextResponse.json({ summary });
  } catch (e) {
    return NextResponse.json({ summary: 'Não foi possível gerar o resumo no momento.' }, { status: 200 });
  }
}
