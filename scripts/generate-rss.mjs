import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { getPublishedBlogArticles } from '../src/data/blogArticles.ts'
import { generateRssXml } from '../src/services/rssFeed.ts'

const distDirectory = path.resolve('dist')
const articles = getPublishedBlogArticles()
const feed = generateRssXml(articles)

await mkdir(distDirectory, { recursive: true })
await Promise.all([
  writeFile(path.join(distDirectory, 'feed.xml'), feed),
])

console.log(`RSS gerado com ${articles.length} artigos publicados.`)
