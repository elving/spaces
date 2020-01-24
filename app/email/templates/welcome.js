export default () => (`
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
                    <h1 style="font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; color: #666; font-size: 26px; line-height: 32px; text-align: center; margin: 0 auto 35px;">
                      Welcome to Spaces!
                    </h1>

                    <h2 style="font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; color: #666; font-size: 18px; line-height: 26px; margin: 0 0 35px; font-weight: normal; text-align: center;">
                      Spaces features the best products for your home from all over the web, curated and maintained by our community (and now you!).
                    </h2>

                    <hr style="border-top: 1px solid #eaeaea;border-bottom: 0 none;"/>

                    <!-- Icon Section -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">
                      <tr>
                        <td style="padding: 35px 0 15px; text-align: center;">
                          <img src="https://d2xpms98gwggxd.cloudfront.net/static/images/curate_icon.png" width="35" height="auto" alt="" border="0" style="height: auto; background: #ffffff; font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 18px; line-height: 26px; color: #666;">
                        </td>
                      </tr>
                    </table>

                    <p style="font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; color: #666; font-size: 18px; line-height: 26px; margin: 0 0 15px; text-align: center;">
                      Recommend products your'e passionate about. We hand-pick recommendations on a daily basis to ensure the quality of our catalog.
                    </p>

                    <!-- Button : Begin -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">
                      <tr>
                        <td style="padding: 0 0 35px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto;">
                            <tr>
                              <td style="border-radius: 3px; background: #ececec;" class="button-td">
                                <a href="https://joinspaces.co/about#curating-products" style="background: #ececec; border: 15px solid #ececec; font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; line-height: 1.1; text-align: center; text-decoration: none; display: block; border-radius: 3px; font-weight: bold;" class="button-a">
                                  <span style="color:#666;" class="button-link">&nbsp;&nbsp;&nbsp;&nbsp;Learn More&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <!-- Button : END -->

                    <hr style="border-top: 1px solid #eaeaea;border-bottom: 0 none;" />
                    <!-- /Icon Section -->

                    <!-- Icon Section -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">
                      <tr>
                        <td style="padding: 35px 0 15px; text-align: center;">
                          <img src="https://d2xpms98gwggxd.cloudfront.net/static/images/like_icon.png" width="35" height="auto" alt="" border="0" style="height: auto; background: #ffffff; font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 18px; line-height: 26px; color: #666;">
                        </td>
                      </tr>
                    </table>

                    <p style="font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; color: #666; font-size: 18px; line-height: 26px; margin: 0 0 15px; text-align: center;">
                      Like products and spaces you love and they will show up on your profile.
                    </p>

                    <!-- Button : Begin -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">
                      <tr>
                        <td style="padding: 0 0 35px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto;">
                            <tr>
                              <td style="border-radius: 3px; background: #ececec;" class="button-td">
                                <a href="https://joinspaces.co/about#following-and-liking" style="background: #ececec; border: 15px solid #ececec; font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; line-height: 1.1; text-align: center; text-decoration: none; display: block; border-radius: 3px; font-weight: bold;" class="button-a">
                                  <span style="color:#666;" class="button-link">&nbsp;&nbsp;&nbsp;&nbsp;Learn More&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <!-- Button : END -->

                    <hr style="border-top: 1px solid #eaeaea;border-bottom: 0 none;" />
                    <!-- /Icon Section -->

                    <!-- Icon Section -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">
                      <tr>
                        <td style="padding: 35px 0 15px; text-align: center;">
                          <img src="https://d2xpms98gwggxd.cloudfront.net/static/images/design_icon.png" width="35" height="auto" alt="" border="0" style="height: auto; background: #ffffff; font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 18px; line-height: 26px; color: #666;">
                        </td>
                      </tr>
                    </table>

                    <p style="font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; color: #666; font-size: 18px; line-height: 26px; margin: 0 0 15px; text-align: center;">
                      Design kitchens, bedrooms, living rooms and other spaces with the best home products from the web.
                    </p>

                    <!-- Button : Begin -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">
                      <tr>
                        <td style="padding: 0 0 35px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto;">
                            <tr>
                              <td style="border-radius: 3px; background: #ececec;" class="button-td">
                                <a href="https://joinspaces.co/about#designing-spaces" style="background: #ececec; border: 15px solid #ececec; font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; line-height: 1.1; text-align: center; text-decoration: none; display: block; border-radius: 3px; font-weight: bold;" class="button-a">
                                  <span style="color:#666;" class="button-link">&nbsp;&nbsp;&nbsp;&nbsp;Learn More&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <!-- Button : END -->

                    <hr style="border-top: 1px solid #eaeaea;border-bottom: 0 none;" />
                    <!-- /Icon Section -->

                    <!-- Text-Button Section -->
                    <p style="font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; color: #666; font-size: 18px; line-height: 26px; margin: 35px 0 15px; text-align: center;">
                      Try our product finder, a smart and easy way to find products for your home.
                    </p>

                    <!-- Button : Begin -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">
                      <tr>
                        <td style="padding: 0 0 35px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto;">
                            <tr>
                              <td style="border-radius: 3px; background: #439fe0;" class="button-tdb">
                                <a href="https://joinspaces.co/finder" style="background: #439fe0; border: 15px solid #439fe0; font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; line-height: 1.1; text-align: center; text-decoration: none; display: block; border-radius: 3px; font-weight: bold;" class="button-b">
                                  <span style="color:#fff;" class="button-link">&nbsp;&nbsp;&nbsp;&nbsp;Product Finder&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <!-- Button : END -->

                    <hr style="border-top: 1px solid #eaeaea;border-bottom: 0 none;" />
                    <!-- /Text-Button Section -->

                    <!-- Text-Button Section -->
                    <p style="font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; color: #666; font-size: 18px; line-height: 26px; margin: 35px 0 15px; text-align: center;">
                      Invite your friends. Everything's better with friends!
                    </p>

                    <!-- Button : Begin -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">
                      <tr>
                        <td style="padding: 0 0 35px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto;">
                            <tr>
                              <td style="border-radius: 3px; background: #439fe0;" class="button-tdb">
                                <a href="https://joinspaces.co/friends" style="background: #439fe0; border: 15px solid #439fe0; font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; line-height: 1.1; text-align: center; text-decoration: none; display: block; border-radius: 3px; font-weight: bold;" class="button-b">
                                  <span style="color:#fff;" class="button-link">&nbsp;&nbsp;&nbsp;&nbsp;Invite Friends&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <!-- Button : END -->

                    <hr style="border-top: 1px solid #eaeaea;border-bottom: 0 none;" />
                    <!-- /Text-Button Section -->

                    <!-- Text-Button Section -->
                    <p style="font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; color: #666; font-size: 18px; line-height: 26px; margin: 35px 0 15px; text-align: center;">
                      Follow us to stay up to date with our latest news and features.
                    </p>

                    <!-- Social Icons -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" class="mcnFollowContent">
                      <tbody>
                        <tr>
                          <td align="center" valign="top" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                              <tbody>
                                <tr>
                                  <td align="center" valign="top" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                    <!--[if mso]><table align="center" border="0" cellspacing="0" cellpadding="0"><tr><![endif]-->
                                    <!--[if mso]><td align="center" valign="top"><![endif]-->
                                    <table class="social-link-table" align="left" border="0" cellpadding="0" cellspacing="0" style="display: inline;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%; table-layout: auto !important;">
                                      <tbody>
                                        <tr>
                                          <td valign="top" style="padding-right: 10px;padding-bottom: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" class="mcnFollowContentItemContainer">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowContentItem" style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                              <tbody>
                                                <tr>
                                                  <td align="left" valign="middle" style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                                    <table align="left" border="0" cellpadding="0" cellspacing="0" width="" style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                                      <tbody>
                                                        <tr>
                                                          <td align="center" valign="middle" width="24" class="mcnFollowIconContent" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                                            <a href="https://twitter.com/joinspaces" target="_blank" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                                              <img src="https://cdn-images.mailchimp.com/icons/social-block-v2/color-twitter-48.png" style="display: block;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;" height="24" width="24" class="">
                                                            </a>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!--[if mso]></td><![endif]-->
                                    <!--[if mso]><td align="center" valign="top"><![endif]-->
                                    <table class="social-link-table" align="left" border="0" cellpadding="0" cellspacing="0" style="display: inline;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%; table-layout: auto !important;">
                                      <tbody>
                                        <tr>
                                          <td valign="top" style="padding-right: 10px;padding-bottom: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" class="mcnFollowContentItemContainer">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowContentItem" style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                              <tbody>
                                                <tr>
                                                  <td align="left" valign="middle" style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                                    <table align="left" border="0" cellpadding="0" cellspacing="0" width="" style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                                      <tbody>
                                                        <tr>
                                                          <td align="center" valign="middle" width="24" class="mcnFollowIconContent" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                                            <a href="https://www.facebook.com/joinspaces/" target="_blank" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                                              <img src="https://cdn-images.mailchimp.com/icons/social-block-v2/color-facebook-48.png" style="display: block;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;" height="24" width="24" class="">
                                                            </a>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!--[if mso]></td><![endif]-->
                                    <!--[if mso]><td align="center" valign="top"><![endif]-->
                                    <table class="social-link-table" align="left" border="0" cellpadding="0" cellspacing="0" style="display: inline;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%; table-layout: auto !important;">
                                      <tbody>
                                        <tr>
                                          <td valign="top" style="padding-right: 10px;padding-bottom: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" class="mcnFollowContentItemContainer">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowContentItem" style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                              <tbody>
                                                <tr>
                                                  <td align="left" valign="middle" style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                                    <table align="left" border="0" cellpadding="0" cellspacing="0" width="" style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                                      <tbody>
                                                        <tr>
                                                          <td align="center" valign="middle" width="24" class="mcnFollowIconContent" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                                            <a href="https://www.instagram.com/joinspaces/" target="_blank" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                                              <img src="https://cdn-images.mailchimp.com/icons/social-block-v2/color-instagram-48.png" style="display: block;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;" height="24" width="24" class="">
                                                            </a>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!--[if mso]></td><![endif]-->
                                    <!--[if mso]><td align="center" valign="top"><![endif]-->
                                    <table class="social-link-table" align="left" border="0" cellpadding="0" cellspacing="0" style="display: inline;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%; table-layout: auto !important;">
                                      <tbody>
                                        <tr>
                                          <td valign="top" style="padding-right: 0;padding-bottom: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" class="mcnFollowContentItemContainer">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowContentItem" style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                              <tbody>
                                                <tr>
                                                  <td align="left" valign="middle" style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                                    <table align="left" border="0" cellpadding="0" cellspacing="0" width="" style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                                      <tbody>
                                                        <tr>
                                                          <td align="center" valign="middle" width="24" class="mcnFollowIconContent" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                                            <a href="https://joinspaces.co/" target="_blank" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                                              <img src="https://cdn-images.mailchimp.com/icons/social-block-v2/color-link-48.png" style="display: block;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;" height="24" width="24" class="">
                                                            </a>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <!--[if mso]></td><![endif]-->
                                    <!--[if mso]></tr></table><![endif]-->
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- /Social Icons -->
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Email Footer : BEGIN -->
          <!--
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 680px;">
            <tr>
              <td style="padding: 40px 10px;width: 100%;font-size: 12px; font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; line-height:18px; text-align: center; color: #888888;" class="x-gmail-data-detectors">
                <webversion style="color:#cccccc; text-decoration:underline; font-weight: bold;">View as a Web Page</webversion>
                <p style="font-size: 12px; font-family: 'Lato', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; line-height:18px; text-align: center; color: #888888;>
                  Spaces <br/>
                  P.O. Box 9114 Bayamon PR 00960 <br/>
                  (787) 555-5555
                </p>
                <unsubscribe style="color:#888888; text-decoration:underline;">unsubscribe</unsubscribe>
              </td>
            </tr>
          </table>
          -->
          <!-- Email Footer : END -->
          <!--[if mso]></td></tr></table><![endif]-->
          </div>
      </center>
  </body>
</html>
`)
