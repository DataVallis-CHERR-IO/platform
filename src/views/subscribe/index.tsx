import useTranslation from 'next-translate/useTranslation'
import React, { useRef } from 'react'

const Subscribe: React.FC = () => {
  const { t } = useTranslation('common')
  const emailRef = useRef(null)
  // const subscribers = useSubscribers();
  //
  const subscribe = async event => {
    event.preventDefault()

    // await setSubscribe(emailRef.current.value);
  }
  //
  // useEffect(() => {
  //     console.log('subscribers', subscribers)
  //
  // }, [subscribers])

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
                    <button type='submit' id='subscribe-submit' onClick={event => subscribe(event)}>
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
