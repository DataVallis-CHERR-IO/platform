import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <link rel='icon' href='/favicon.ico' />
          <link href='https://fonts.googleapis.com/css?family=Poppins:300,300i,400,400i,500,500i,600,700,800,900&subset=latin-ext' rel='stylesheet' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
