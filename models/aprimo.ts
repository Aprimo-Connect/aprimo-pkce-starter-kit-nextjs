export type AprimoRecord = {
  id: string
  contentType?: string
  status?: string
  _embedded?: {
    masterfilelatestversion?: {
      _embedded?: {
        thumbnail?: { uri?: string }
      }
    }
  }
  [key: string]: unknown
}
