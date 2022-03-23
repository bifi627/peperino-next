import { createStylesServer, ServerStyles } from '@mantine/next';
import Document, { DocumentContext } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document
{
    static async getInitialProps( context: DocumentContext )
    {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = context.renderPage;

        try
        {
            // Styled components
            context.renderPage = () =>
                originalRenderPage( {
                    enhanceApp: ( App: any ) => ( props: any ) =>
                        sheet.collectStyles( <App {...props} /> ),
                } );

            // mantine ui
            const stylesServer = createStylesServer();

            const initialProps = await Document.getInitialProps( context )
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                        <ServerStyles html={initialProps.html} server={stylesServer} />
                    </>
                ),
            }
        } finally
        {
            sheet.seal()
        }
    }
}