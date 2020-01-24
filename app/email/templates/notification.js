import get from 'lodash/get'

import renderHTML from '../../api/notification/renderHTML'

const getIcon = notification => {
  switch (get(notification, 'action')) {
    case 'like': {
      return 'like_icon.png'
    }

    case 'comment': {
      return 'comment_icon.png'
    }

    case 'redesign': {
      return 'redesign_icon.png'
    }

    case 'follow': {
      return 'follow_icon.png'
    }

    case 'approve': {
      return 'approved_icon.png'
    }

    default: {
      return ''
    }
  }
}

export default notification => (`
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8"> <!-- utf-8 works for most cases -->
    <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
    <meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
    <!-- Web Font / @font-face : BEGIN -->
	  <!-- NOTE: If web fonts are not required, lines 10 - 27 can be safely removed. -->

    <!-- Desktop Outlook chokes on web font references and defaults to Times New Roman, so we force a safe fallback font. -->
    <!--[if mso]>
      <style>
        * {
          font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif !important;
        }
      </style>
    <![endif]-->

    <!-- All other clients get the webfont reference; some will render the font and others will silently fail to the fallbacks. More on that here: http://stylecampaign.com/blog/2015/02/webfont-support-in-email/ -->
    <!--[if !mso]><!-->
      <!-- insert web font reference, eg: <link href='https://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'> -->
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,300,100,400italic,700,900&subset=latin,latin-ext"/>
    <!--<![endif]-->

    <!-- Web Font / @font-face : END -->

	<!-- CSS Reset -->
    <style>
      /* What it does: Remove spaces around the email design added by some email clients. */
      /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
      html,
      body {
        margin: 0 auto !important;
        padding: 0 !important;
        height: 100% !important;
        width: 100% !important;
      }

      /* What it does: Stops email clients resizing small text. */
      * {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }

      /* What is does: Centers email on Android 4.4 */
      div[style*="margin: 16px 0"] {
        margin:0 !important;
      }

      /* What it does: Stops Outlook from adding extra spacing to tables. */
      table,
      td {
        mso-table-lspace: 0pt !important;
        mso-table-rspace: 0pt !important;
      }

      /* What it does: Fixes webkit padding issue. Fix for Yahoo mail table alignment bug. Applies table-layout to the first 2 tables then removes for anything nested deeper. */
      table {
        border-spacing: 0 !important;
        border-collapse: collapse !important;
        table-layout: fixed !important;
        margin: 0 auto !important;
      }

      table table table {
        table-layout: auto;
      }

      /* What it does: Uses a better rendering method when resizing images in IE. */
      img {
        -ms-interpolation-mode:bicubic;
      }

      /* What it does: A work-around for iOS meddling in triggered links. */
      *[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
      }

      /* What it does: A work-around for Gmail meddling in triggered links. */
      .x-gmail-data-detectors,
      .x-gmail-data-detectors *,
      .aBn {
        border-bottom: 0 !important;
        cursor: default !important;
      }


      /* What it does: Prevents underlining the button text in Windows 10 */
      .button-link {
        text-decoration: none !important;
      }

      /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
      /* Create one of these media queries for each additional viewport size you'd like to fix */
      /* Thanks to Eric Lepetit @ericlepetitsf) for help troubleshooting */
      @media only screen and (min-device-width: 375px) and (max-device-width: 413px) { /* iPhone 6 and 6+ */
        .email-container {
          min-width: 375px !important;
        }
      }
    </style>

    <!-- Progressive Enhancements -->
    <style>
      /* What it does: Hover styles for buttons */
      .button-td,
      .button-a,
      .button-tdb,
      .button-b, {
        transition: all 100ms ease-in;
      }

      .button-td:hover,
      .button-a:hover {
        background: #dedede !important;
        border-color: #dedede !important;
      }

      .button-tdb:hover,
      .button-b:hover {
        background: #3f95d2 !important;
        border-color: #3f95d2 !important;
      }
    </style>

    <style>
      .social-link-table,
      .social-link-table table {
        table-layout: auto !important;
      }
    </style>
  </head>
  <body width="100%" bgcolor="#f5f5f5" style="margin: 0; mso-line-height-rule: exactly;">
    <center style="width: 100%; background: #f5f5f5;">
      <!--
        Set the email width. Defined in two places:
        1. max-width for all clients except Desktop Windows Outlook, allowing the email to squish on narrow but never go wider than 600px.
        2. MSO tags for Desktop Windows Outlook enforce a 600px width.
      -->
      <div style="max-width: 600px; margin: auto;" class="email-container">
        <!--[if mso]>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" align="center"><tr><td>
        <![endif]-->

        <!-- Email Header : BEGIN -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">
          <tr>
            <td style="padding: 35px 0; text-align: center;">
              <a href="https://joinspaces.co">
                <img src="https://d2xpms98gwggxd.cloudfront.net/static/images/logo_small.png" width="80" height="auto" alt="" border="0" style="height: auto; background: #f5f5f5; font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 18px; line-height: 26px; color: #666;">
              </a>
            </td>
          </tr>
        </table>
        <!-- Email Header : END -->

        <!-- Email Body : BEGIN -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">
          <!-- 1 Column Text + Button : BEGIN -->
          <tr>
            <td bgcolor="#ffffff">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 35px; font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; color: #666;">
                    <!-- Icon Section -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">
                      <tr>
                        <td style="padding: 35px 0 15px; text-align: center;">
                          <img src="https://d2xpms98gwggxd.cloudfront.net/static/images/${getIcon(notification)}" width="35" height="auto" alt="" border="0" style="height: auto; background: #ffffff; font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 18px; line-height: 26px; color: #666;">
                        </td>
                      </tr>
                    </table>

                    <p style="font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; color: #666; font-size: 18px; line-height: 26px; margin: 0 0 15px; text-align: center;">
                      ${renderHTML(notification)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Email Footer : BEGIN -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 680px;">
            <tr>
              <td style="padding: 40px 10px;width: 100%;font-size: 12px; font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; line-height:18px; text-align: center; color: #888888;" class="x-gmail-data-detectors">
                <!--
                <webversion style="color:#cccccc; text-decoration:underline; font-weight: bold;">View as a Web Page</webversion>
                <p style="font-size: 12px; font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; line-height:18px; text-align: center; color: #888888;>
                  Spaces <br/>
                  P.O. Box 9114 Bayamon PR 00960 <br/>
                  (787) 555-5555
                </p>
                <unsubscribe style="color:#888888; text-decoration:underline;">unsubscribe</unsubscribe>
                -->
              </td>
            </tr>
          </table>
          <!-- Email Footer : END -->
          <!--[if mso]></td></tr></table><![endif]-->
        </div>
      </center>
  </body>
</html>
`)
