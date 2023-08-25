import Database from 'bun:sqlite'
import type { CromoHandler } from 'cromo'

export const GET: CromoHandler = ({ responseInit }) => {
  const db = new Database('./src/database/himnario.db')
  const query = db.query('SELECT id, number, title, mp3Url, mp3Filename, mp3UrlInstr FROM hymn')

  return Response.json(query.all(), responseInit)
}
