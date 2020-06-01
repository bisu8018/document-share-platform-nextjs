export default class CreatorRoyalty {
  public documentId: string
  public latestPageview: number

  public constructor(data) {
    this.documentId =
      data && (data.documentId || data._id) ? data.documentId || data._id : ''
    this.latestPageview = data && data.latestPageview ? data.latestPageview : 0
  }
}
