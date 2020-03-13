import AxiosService from './AxiosService'

let getDocumentUrl = 'document/info'
let getDocumentListUrl = 'document/list'
let voteDocumentUrl = 'document/vote'
let documentDownloadUrl = 'document/download'
let registerDocumentInfoUrl = 'document/regist'
let updateDocumentUrl = 'document/update'
let documentPdfUrl = 'document/pdf'
let getDocumentsUrl = 'account/documents'
let getCuratorDocumentsUrl = 'curator/document/list'

export default {
  GET: {
    document: data => {
      return new Promise((resolve, reject) => {
        AxiosService._requestWithUrlPram(
          getDocumentUrl + '/' + data,
          'GET',
          null,
          data => resolve(data),
          err => reject(err)
        )
      })
    },
    documents: data => {
      return new Promise((resolve, reject) => {
        AxiosService._requestGetWithHeader(
          getDocumentsUrl,
          'GET',
          data,
          data => resolve(data),
          err => reject(err)
        )
      })
    },
    documentList: data => {
      return new Promise((resolve, reject) => {
        AxiosService._requestWithUrlPram(
          getDocumentListUrl,
          'GET',
          data,
          data => resolve(data),
          err => reject(err)
        )
      })
    },
    documentDownload: data => {
      return new Promise((resolve, reject) => {
        AxiosService._requestWithUrlPram(
          documentDownloadUrl,
          'GET',
          data,
          data => resolve(data),
          err => reject(err)
        )
      })
    },
    curatorDocuments: data => {
      return new Promise((resolve, reject) => {
        AxiosService._requestWithUrlPram(
          getCuratorDocumentsUrl,
          'GET',
          data,
          data => resolve(data),
          err => reject(err)
        )
      })
    },
    documentPdfUrl: data => {
      return new Promise((resolve, reject) => {
        AxiosService._requestWithUrlPram(
          documentPdfUrl,
          'GET',
          data,
          data => resolve(data),
          err => reject(err)
        )
      })
    }
  },
  POST: {
    sendVoteInfo: (data, callback, error) => {
      AxiosService._requestWithUrlPram(
        voteDocumentUrl,
        'POST',
        data,
        data => callback(data),
        err => error(err)
      )
    },
    registerDocument: (data, callback, error) => {
      AxiosService._requestWithHeaderBody(
        registerDocumentInfoUrl,
        'POST',
        data,
        data => callback(data),
        err => error(err)
      )
    },
    updateDocument: data => {
      return new Promise((resolve, reject) => {
        AxiosService._requestWithHeaderBody(
          updateDocumentUrl,
          'POST',
          data,
          data => resolve(data),
          err => reject(err)
        )
      })
    }
  }
}
