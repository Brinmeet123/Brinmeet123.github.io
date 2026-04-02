import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { normalizeVocabTerm } from '@/lib/vocabNormalize'
import { z } from 'zod'

const postSchema = z.object({
  term: z.string().trim().min(1).max(500),
  definition: z.string().trim().min(1).max(8000),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rows = await prisma.vocab.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const json = await req.json()
    const parsed = postSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid term or definition.' }, { status: 400 })
    }

    const { term: rawTerm, definition } = parsed.data
    const termKey = normalizeVocabTerm(rawTerm)
    if (!termKey) {
      return NextResponse.json({ error: 'Invalid term.' }, { status: 400 })
    }

    const displayTerm = rawTerm.trim()

    const row = await prisma.vocab.upsert({
      where: {
        userId_term: {
          userId: session.user.id,
          term: termKey,
        },
      },
      create: {
        userId: session.user.id,
        term: termKey,
        definition,
      },
      update: {
        definition,
      },
    })

    return NextResponse.json(row, { status: 201 })
  } catch (e) {
    console.error('vocab POST:', e)
    return NextResponse.json({ error: 'Failed to save vocabulary.' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id.' }, { status: 400 })
  }

  const existing = await prisma.vocab.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!existing) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  }

  await prisma.vocab.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
