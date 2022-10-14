import useTranslation from 'next-translate/useTranslation'
import React, { useRef } from 'react'
import { apolloClient } from '../../clients/graphql'
import { MUTATION_SUBSCRIBE } from '../../constants/queries/moralis/subscriber'
import { useMutation } from 'react-query'
import { notify } from '../../utils/notify'

const Subscribe: React.FC = () => {
  const { t } = useTranslation('common')
  const emailRef = useRef<HTMLInputElement>(null)

  const subscribe = variables =>
    apolloClient.mutate({
      mutation: MUTATION_SUBSCRIBE,
      variables
    })

  const { mutateAsync: subscribeMutation } = useMutation(subscribe)

  const submit = async event => {
    event.preventDefault()

    const subscription = await subscribeMutation({ email: emailRef.current.value })
    notify(t(`subscribe.${subscription.data.subscribe}`), subscription.data.subscribe === 'success' ? 'success' : 'warning')

    emailRef.current.value = ''
  }

  return (
    <section className='section-updates' id='updates'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12 animation-1'>
            <div className='subscribe-form'>
              <div className='subscribe-form-left'>
                <h4 className='color-silver'>{t('subscribe.title')}</h4>
                <p>{t('subscribe.subtitle')}</p>
              </div>
              <div className='subscribe-form-right'>
                <form method='POST'>
                  <div className='subscribe-wrapper'>
                    <input ref={emailRef} type='text' id='email' name='email' placeholder={t('enterYourEmailAddress')} />
                    <button type='submit' id='subscribe-submit' onClick={submit}>
                      {t('subscribe.text')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Subscribe
