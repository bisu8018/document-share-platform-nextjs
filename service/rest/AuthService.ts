import AxiosService from './AxiosService'

let accountSyncUrl = 'account/sync'
let accountGetUrl = 'account/get'
let accountUpdateUrl = 'account/update'
let profileImageUpdateUrl = 'account/picture'
let profileGetUrl = 'profile/get'
let userInfoUrl = 'authentication/userinfo'

export default {
  POST: {
    syncAuthAndRest: data =>
      new Promise((resolve, reject) => {
        AxiosService._requestWithHeader(
          accountSyncUrl,
          'POST',
          data,
          data => resolve(data),
          err => reject(err)
        )
      }),
    accountUpdate: data =>
      new Promise((resolve, reject) => {
        AxiosService._requestWithHeaderBody(
          accountUpdateUrl,
          'POST',
          data,
          data => resolve(data),
          err => reject(err)
        )
      }),
    profileImageUpdate: data =>
      new Promise((resolve, reject) => {
        AxiosService._requestWithHeader(
          profileImageUpdateUrl,
          'POST',
          data,
          data => resolve(data),
          err => reject(err)
        )
      })
  },
  GET: {
    profileGet: data =>
      new Promise((resolve, reject) => {
        AxiosService._requestWithUrlParam(
          profileGetUrl,
          'GET',
          data,
          data => resolve(data),
          err => reject(err)
        )
      }),
    accountInfo: data =>
      new Promise((resolve, reject) => {
        AxiosService._requestGetWithHeader(
          accountGetUrl,
          'GET',
          data,
          data => resolve(data),
          err => reject(err)
        )
      }),
    userInfo: data =>
      new Promise((resolve, reject) => {
        AxiosService._requestWithUrlParamForAuth(
          userInfoUrl,
          'GET',
          data,
          data => resolve(data),
          err => reject(err)
        )
      })
  }
}
