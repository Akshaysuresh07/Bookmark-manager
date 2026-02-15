export interface Bookmark {
    id: string
    title: string
    url: string
    created_at: string
    user_id: string
}

export type CreateBookmarkInput = Pick<Bookmark, 'title' | 'url' | 'user_id'>
