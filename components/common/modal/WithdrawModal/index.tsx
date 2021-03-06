import React, { ReactElement, useEffect, useState } from 'react'
import { FadingCircle } from 'better-react-spinkit'
import { psString } from 'utils/localization'
import commonView from '../../../../common/commonView'
import repos from 'utils/repos'
import common from '../../../../common/common'
import * as styles from 'public/static/styles/scss/index.scss'
import WalletBalance from '../../../../service/model/WalletBalance'
import { useMain } from '../../../../redux/main/hooks'
import { useProfile } from '../../../../redux/profile/hooks'

export default function WithdrawModal(): ReactElement {
  const { myInfo, setModal, setAlertCode } = useMain()
  const { setWithdrawPending } = useProfile()
  const [closeFlag, setCloseFlag] = useState(false)
  const [loading, setLoading] = useState(false)
  const [balanceLoading, setBalanceLoading] = useState(true)
  const [balance, setBalance] = useState(new WalletBalance(null))
  const [amount, setAmount] = useState(0)
  const [address, setAddress] = useState('')
  const [deckError, setDeckError] = useState('')
  const [walletError, setWalletError] = useState('')

  // 잔액 조회
  const getBalance = () =>
    repos.Wallet.getWalletBalance({ userId: myInfo.id })
      .then((res): void => {
        setBalanceLoading(false)
        setBalance(res)
      })
      .catch((): void => {
        setLoading(false)
        setBalance(new WalletBalance(null))
      })

  // 출금 pending 상태 체크
  const getWalletWithdrawRequest = () =>
    repos.Wallet.getWalletWithdrawRequest().then(res => {
      setWithdrawPending(res.length > 0)
    })

  // 모달 숨기기 클래스 추가
  const handleClickCloseFlag = () =>
    new Promise(resolve => resolve(setCloseFlag(true)))

  // 출금 값 유효성 체크
  const validateWithdraw = (value: number) =>
    new Promise(resolve => {
      let errMsg = ''
      if (value <= 0) errMsg = psString('withdraw-modal-err-1')
      else if (value > balance.deck) {
        errMsg = psString('withdraw-modal-err-2')
      }

      setDeckError(errMsg)
      resolve(errMsg)
    })

  // 지갑 주소 값 유효성 체크
  const validateWalletAddress = (value: string) =>
    new Promise(resolve => {
      let errMsg = ''
      if (!value) errMsg = psString('withdraw-modal-err-3')

      setWalletError(errMsg)
      resolve(errMsg)
    })

  // Deck 출금 값 입력 캐치
  const onChangeAmount = e => {
    setAmount(e.target.value)
    return validateWithdraw(e.target.value)
  }

  // 지갑 주소 값 입력 캐치
  const onChangeWalletAddress = e => {
    setAddress(e.target.value)
    return validateWalletAddress(e.target.value)
  }

  // 종료 버튼 관리
  const handleClickClose = () =>
    handleClickCloseFlag()
      .then(() => common.delay(200))
      .then(() => setModal(''))

  // 출금 api POST
  const handleWalletWithdraw = () => {
    repos.Wallet.walletWithdraw({
      amount: Number(amount),
      toAddress: address
    })
      .then(async () => {
        await getWalletWithdrawRequest()
        setLoading(false)
        setAlertCode(2035)
        return handleClickClose()
      })
      .catch((err): void => {
        setAlertCode(2036)
        console.log(err)
      })
  }

  // 확인 버튼 관리
  const handleConfirm = async () => {
    if (balance.deck <= 0) return

    setLoading(true)

    let validAmountValue = await validateWithdraw(amount)
    let validAddressValue = await validateWalletAddress(address)

    if (validAmountValue === '' && validAddressValue === '')
      return handleWalletWithdraw()
  }

  // 키 다운 관리
  const handleKeyDown = e => {
    if (e.keyCode === 13) return handleConfirm()
  }

  useEffect(() => {
    void getBalance()
    commonView.setBodyStyleLock()

    return () => {
      commonView.setBodyStyleUnlock()
    }
  }, [])

  return (
    <div className={styles.modal_container}>
      <div
        className={
          styles.modal_body + ' ' + (closeFlag ? styles.modal_hide : '')
        }
      >
        <div className={styles.modal_title}>
          <i
            className={'material-icons ' + styles.modal_closeBtn}
            onClick={() => handleClickClose()}
          >
            close
          </i>
          <h3>{psString('withdraw-modal-title')}</h3>
        </div>

        <div className={styles.modal_content}>
          <div className={styles.modal_subject}>
            {psString('withdraw-modal-subj-1')}
          </div>
          <div className={styles.wm_amount}>
            {balanceLoading ? (
              <FadingCircle color="#3681fe" size={17} />
            ) : (
              <span>
                {'$ ' + common.withComma(balance.dollar)}
                <span>{'(' + balance.deck + ' POLA)'}</span>
              </span>
            )}
          </div>
          <div className={styles.modal_subject}>
            {psString('withdraw-modal-subj-2')}
          </div>
          <input
            type="number"
            placeholder="POLA"
            autoComplete="off"
            id="withdraw"
            className={
              styles.wm_input +
              ' ' +
              (deckError.length > 0 ? styles.wm_inputWarning : '')
            }
            onChange={e => onChangeAmount(e)}
            onKeyDown={e => handleKeyDown(e)}
          />
          <span>{deckError}</span>

          <div className={styles.modal_subject}>
            {psString('withdraw-modal-wallet-address')}
          </div>
          <input
            type="text"
            placeholder="Address"
            autoComplete="off"
            id="walletAddress"
            className={
              styles.wm_input +
              ' ' +
              (walletError.length > 0 ? styles.wm_inputWarning : '')
            }
            onChange={e => onChangeWalletAddress(e)}
            onKeyDown={e => handleKeyDown(e)}
          />
          <span>{walletError}</span>
        </div>

        <div className={styles.modal_footer}>
          <div
            onClick={() => handleClickClose()}
            className={styles.modal_cancelBtn}
          >
            {psString('common-modal-cancel')}
          </div>
          <div
            onClick={() => handleConfirm()}
            className={
              styles.modal_okBtn +
              ' ' +
              (loading && styles.wm_common_disabledBtn)
            }
          >
            {loading && (
              <div className={styles.edm_loadingWrapper}>
                <FadingCircle color="#3681fe" size={17} />
              </div>
            )}
            {psString('common-modal-confirm')}
          </div>
        </div>
      </div>
    </div>
  )
}
