export default class WalletHistoryData {
  public id: string
  public userId: string
  public address: string
  public type: string
  public from: string
  public to: string
  public factor: number
  public value: any
  public transactionHash: string
  public created: number

  public constructor(data) {
    this.id = data && data._id ? data._id : ''
    this.userId = data && data.userId ? data.userId : ''
    this.address = data && data.address ? data.address : ''
    this.type = data && data.type ? data.type : ''
    this.from = data && data.from ? data.from : ''
    this.to = data && data.to ? data.to : ''
    this.factor = data && data.factor ? data.factor : -1
    this.value = data && Number(data.value.toString()) ? Number(data.value) : 0
    this.transactionHash =
      data && data.transactionHash ? data.transactionHash : ''
    this.created = data && data.created ? data.created : 0
  }
}
