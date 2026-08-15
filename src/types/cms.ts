export type CmsRole = 'admin' | 'editor'
export type CmsArticleStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'archived'
export type EditorDoc = { type: 'doc'; content?: Array<Record<string, unknown>> }

export type CmsUser = { id: string; username: string; display_name: string; role: CmsRole; is_active?: boolean }
export type CmsCategory = { id: string; name: string; slug: string; description: string }
export type CmsFaq = { question: string; answer: string }
export type CmsProtocol = { title: string; introduction?: string; steps: Array<{ title: string; description: string }> }
export type CmsCta = { title: string; text: string; label: string; href: string }

export type CmsArticle = {
  id: string
  title: string
  slug: string
  excerpt: string
  content_json: { doc: EditorDoc }
  content_html: string
  image_instruction: string
  cover_image_url: string | null
  cover_image_webp_url: string | null
  cover_image_alt: string
  cover_image_status: 'missing' | 'generated' | 'approved' | 'uploaded'
  category_id: string | null
  cms_categories?: CmsCategory
  author_id: string
  author?: CmsUser
  cms_profiles?: { display_name: string; bio?: string; avatar_url?: string }
  status: CmsArticleStatus
  meta_title: string
  meta_description: string
  canonical_url: string
  keywords: string[]
  show_table_of_contents: boolean
  show_editorial_notice: boolean
  editorial_notice_text: string | null
  cta_heading_id: string | null
  cta_json: CmsCta | null
  protocol_json: CmsProtocol | null
  checklist_json: string[]
  faq_json: CmsFaq[]
  related_article_ids: string[]
  legacy_related_paths: string[]
  reading_time_minutes: number
  published_at: string | null
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  published_by: string | null
}

export const emptyCmsArticle = (userId: string): Partial<CmsArticle> => ({
  title: '', slug: '', excerpt: '', content_json: { doc: { type: 'doc', content: [{ type: 'paragraph' }] } }, image_instruction: '', cover_image_url: null, cover_image_webp_url: null, cover_image_alt: '', cover_image_status: 'missing', category_id: null, author_id: userId, status: 'draft', meta_title: '', meta_description: '', keywords: [], show_table_of_contents: true, show_editorial_notice: false, editorial_notice_text: null, cta_heading_id: null, cta_json: null, protocol_json: null, checklist_json: [], faq_json: [], related_article_ids: [], legacy_related_paths: [], reading_time_minutes: 1,
})
