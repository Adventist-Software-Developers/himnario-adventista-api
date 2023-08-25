import Database from 'bun:sqlite'
import type { CromoHandler } from 'cromo'

export const GET: CromoHandler = ({ params, responseInit }) => {
  const { id } = params

  const db = new Database('./src/database/himnario.db')
  const hymn = db
    .query('SELECT id, number, title, mp3Url, mp3UrlInstr, mp3Filename FROM hymn WHERE id = ?1')
    .get(id)

  if (!hymn) return Response.json({ error: 'Hymn not found' }, 404)

  let verses = db
    .query(`
      SELECT id, number
      FROM verse
      WHERE hymnId = ?1
      ORDER BY number ASC
    `)
    .all(id)

  verses = verses.map((verse: any) => {
    let content = db
      .query(`
        SELECT id, content
        FROM verseContent
        WHERE verseId = ?1
        ORDER BY ordering ASC
      `)
      .all(verse.id)

    return { ...verse, content }
  })

  let sequence = db
    .query(`
      SELECT vs.id, vs.timestamp, vs.verseContentId
      FROM verseSequence vs
      	INNER JOIN verseContent vc ON vc.id = vs.verseContentId
        INNER JOIN verse v ON v.id = vc.verseId
      WHERE v.hymnId = ?1
      ORDER BY vs.position ASC
    `)
    .all(id)

  return Response.json({ ...hymn, verses, sequence }, responseInit)
}
