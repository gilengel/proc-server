export interface NewPage {
  page_id: string,
  name: string,
  created_at: string
}

export interface UpdateNewPage {
  name?: string,
  created_at?: number
}

export interface Page extends NewPage {
  page_pk: number,
  data: {}
}

export interface NewPageConnection {
  connection_id: string,
  created_at: number,
  incoming_page: number,
  outgoing_page: number
}
export interface PageConnection extends NewPageConnection{
  connection_pk: number,
}

import { GetMultiple, PAGES_URL } from 'src/models/Backend'

export function GetAllPages() : Promise<Array<Page>> {
  return GetMultiple(PAGES_URL)
}
