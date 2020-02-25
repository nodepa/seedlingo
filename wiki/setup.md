# Setup

## Front-end dev env
* Create/clone git repo
* Install nvm according to https://github.com/nvm-sh/nvm
* Install latest lts node globally: `nvm install node` something
* Update npm `npm install -g npm`
* Install vue/react globally
  * `npm install -g create-react-app`
  * `npm install -g @vue/cli`
  * `yarn global add create-react-app`
  * `yarn global add @vue/cli`
* Generate apps
  * `create-react-app shizi-react`
  * `vue create shizi-vue-full`
* Edit manifest
  * `vi shizi-react/public/manifest.json`
  * `vi shizi-vue-full/packages.json` and add a `"vue.pwa.manifestOptions"`-section.
* To test locally, serve with https (`yarn serve -s build --https`) (Chrome only treats it as PWA if served over https)

## Deploy to S3
* A) [SPA on AWS part 1 - Hosting a website on S3](https://medium.com/@P_Lessing/single-page-apps-on-aws-part-1-hosting-a-website-on-s3-3c9871f126)
* B) [Using AWS CloudFront to serve an SPA from S3](https://johnlouros.com/blog/using-CloudFront-to-serve-an-SPA-from-S3)

Combined these two articles give this confirmed procedure:
* A) Step 1 - DNS by CloudFlare
  * Buy DNS name at GoDaddy 60kr liaishizi.com (1yr+discount code)
  * Create cloudFlare account
  * Enter DNS name, remove ALL records on DNS page
  * Enable DEV caching on Caching page
* A) Step 2 - Get certificate
  * AWS ACM region N.Virgina (!), Provision Certificate, Request public, liaishizi.com + *.liaishizi.com, DNS validation
  * Head to CloudFlare and add CNAME records accordingly, only DNS no proxy, only need to add root node since * is equal to root
  * (Skip adding second domain to AWS CloudFront, instead planning to let CloudFlare redirect the subdomain.)
* A) Step 3 - S3 buckets
  * name buckets by defining feature, like `spa-all-public`, or `shizi-vue-pwa`
  * make all public
  * copy from `/build` directory on dev box
  * Properties > Static website hosting, Index: index.html, Error: index.html, Save.
  * (Skip adding second domain to AWS CloudFront, instead planning to let CloudFlare redirect the subdomain.)
* A) Step 4 - AWS CloudFront Distribution : Use B)
  * Origin Domain Name - after picking the correct bucket, remember to also add the **region**, like so: `shizi-vue-pwa.s3.ap-east-1.amazonaws.com`
  * Restrict Bucket Access Yes, Origin Access Id Create New, Grant Read and Automatically Update Bucket Policy.
  * Add ssl cert generated earlier (note: must have been created in region N-Virg)
* A) Step 5 - Error Responses
  * After adding the new configuration, click the ID, navigate to Error Pages, add:
    * 404, custom yes, /index.html, 200 OK
    * 403, custom yes, /index.html, 200 OK **!! This last one is important !!**
* A) Step 6 - Redirect Domain at CloudFlare
  * As described: Add CNAME subdomain to AWS CloudFront domain name.

## Deploy to AWS Amplify
* Generate front end app as described above
* Follow AWS Amplify's [Getting Started](https://docs.aws.amazon.com/amplify/latest/userguide/getting-started.html)
* [Set up custom domain](https://docs.aws.amazon.com/amplify/latest/userguide/custom-domains.html)
* [Configure build settings](https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html)
* [Configure redirects](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html)
* [Configure testing](https://docs.aws.amazon.com/amplify/latest/userguide/running-tests.html)
* [Restrict access](https://docs.aws.amazon.com/amplify/latest/userguide/access-control.html)