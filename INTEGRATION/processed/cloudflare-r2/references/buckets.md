# Cloudflare-R2 - Buckets

**Pages:** 14

---

## Check if requests to a specific endpoint contain more than two malicious content objects

**URL:** llms-txt#check-if-requests-to-a-specific-endpoint-contain-more-than-two-malicious-content-objects

cf.waf.content_scan.num_malicious_obj > 2 and http.request.uri.path eq "/upload"
```

<page>
---
title: cf.waf.content_scan.num_obj · Cloudflare Ruleset Engine docs
description: The number of content objects detected in the request (zero or greater).
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ruleset-engine/rules-language/fields/reference/cf.waf.content_scan.num_obj/
  md: https://developers.cloudflare.com/ruleset-engine/rules-language/fields/reference/cf.waf.content_scan.num_obj/index.md
---

---

## Check if requests to a specific endpoint contain any suspicious or infected content objects

**URL:** llms-txt#check-if-requests-to-a-specific-endpoint-contain-any-suspicious-or-infected-content-objects

any(cf.waf.content_scan.obj_results[*] in {"suspicious" "infected"}) and http.request.uri.path eq "/upload"
```

<page>
---
title: cf.waf.content_scan.obj_sizes · Cloudflare Ruleset Engine docs
description: An array of file sizes in bytes, in the order the content objects
  were detected in the request.
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ruleset-engine/rules-language/fields/reference/cf.waf.content_scan.obj_sizes/
  md: https://developers.cloudflare.com/ruleset-engine/rules-language/fields/reference/cf.waf.content_scan.obj_sizes/index.md
---

---

## "StorageClass": "STANDARD"

**URL:** llms-txt#"storageclass":-"standard"

---

## List all buckets on your account

**URL:** llms-txt#list-all-buckets-on-your-account

puts @r2.list_buckets

#=> {
#=>   :buckets => [{
#=>     :name => "your-bucket",
#=>     :creation_date => "…",
#=>   }],
#=>   :owner => {
#=>     :display_name => "…",
#=>     :id => "…"
#=>   }
#=> }

---

## Check if requests to a specific endpoint contain more than two content objects

**URL:** llms-txt#check-if-requests-to-a-specific-endpoint-contain-more-than-two-content-objects

cf.waf.content_scan.num_obj > 2 and http.request.uri.path eq "/upload"
```

<page>
---
title: cf.waf.content_scan.obj_results · Cloudflare Ruleset Engine docs
description: An array of scan results in the order the content objects were
  detected in the request.
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ruleset-engine/rules-language/fields/reference/cf.waf.content_scan.obj_results/
  md: https://developers.cloudflare.com/ruleset-engine/rules-language/fields/reference/cf.waf.content_scan.obj_results/index.md
---

---

## Check if requests to a specific endpoint include any malicious content objects

**URL:** llms-txt#check-if-requests-to-a-specific-endpoint-include-any-malicious-content-objects

cf.waf.content_scan.has_malicious_obj and http.request.uri.path eq "/upload"
```

<page>
---
title: cf.waf.content_scan.has_obj · Cloudflare Ruleset Engine docs
description: Indicates whether the request contains at least one content object.
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ruleset-engine/rules-language/fields/reference/cf.waf.content_scan.has_obj/
  md: https://developers.cloudflare.com/ruleset-engine/rules-language/fields/reference/cf.waf.content_scan.has_obj/index.md
---

---

## Check if requests to a specific endpoint contain content objects other than PDFs

**URL:** llms-txt#check-if-requests-to-a-specific-endpoint-contain-content-objects-other-than-pdfs

any(cf.waf.content_scan.obj_types[*] != "application/pdf") and http.request.uri.path eq "/upload"
```

<page>
---
title: cf.waf.credential_check.password_leaked · Cloudflare Ruleset Engine docs
description: Indicates whether the password detected in the request was previously leaked.
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ruleset-engine/rules-language/fields/reference/cf.waf.credential_check.password_leaked/
  md: https://developers.cloudflare.com/ruleset-engine/rules-language/fields/reference/cf.waf.credential_check.password_leaked/index.md
---

---

## Removes table from catalog but keeps data files in R2 storage

**URL:** llms-txt#removes-table-from-catalog-but-keeps-data-files-in-r2-storage

spark.sql("DROP TABLE r2dc.namespace.table_name")

---

## Removes unreferenced data files from R2 storage (orphan files)

**URL:** llms-txt#removes-unreferenced-data-files-from-r2-storage-(orphan-files)

spark.sql("""
  CALL r2dc.system.remove_orphan_files(
    table => 'namespace.table_name'
  )
""")

---

## Check if requests to a specific endpoint include any content objects

**URL:** llms-txt#check-if-requests-to-a-specific-endpoint-include-any-content-objects

cf.waf.content_scan.has_obj and http.request.uri.path eq "/upload"
```

<page>
---
title: cf.waf.content_scan.num_malicious_obj · Cloudflare Ruleset Engine docs
description: The number of malicious content objects detected in the request
  (zero or greater).
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ruleset-engine/rules-language/fields/reference/cf.waf.content_scan.num_malicious_obj/
  md: https://developers.cloudflare.com/ruleset-engine/rules-language/fields/reference/cf.waf.content_scan.num_malicious_obj/index.md
---

---

## https://<accountid>.r2.cloudflarestorage.com/my-bucket-name/cat.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=<credential>&X-Amz-Date=<timestamp>&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=<signature>

**URL:** llms-txt#https://<accountid>.r2.cloudflarestorage.com/my-bucket-name/cat.png?x-amz-algorithm=aws4-hmac-sha256&x-amz-credential=<credential>&x-amz-date=<timestamp>&x-amz-expires=3600&x-amz-signedheaders=host&x-amz-signature=<signature>

**Contents:**
- Before you begin
- Workers
- S3-API
- Download via dashboard
- Download via Workers API
- Download via S3 API
  - Presigned URLs
- Download via Wrangler
- Delete via dashboard
- Delete via Workers API

typescript
  interface Environment {
    R2: R2Bucket
    /**
     * In this example, your SSE-C is stored as a hexadecimal string (preferably a secret).
     * The R2 API also supports providing an ArrayBuffer directly, if you want to generate/
     * store your keys dynamically.
    */
    SSEC_KEY: string
  }
  export default {
    async fetch(req: Request, env: Env) {
      const { SSEC_KEY, R2 } = env;
      const { pathname: filename } = new URL(req.url);
      switch(req.method) {
        case "GET": {
          const maybeObj = await env.BUCKET.get(filename, {
            onlyIf: req.headers,
            ssecKey: SSEC_KEY,
          });
          if(!maybeObj) {
            return new Response("Not Found", {
              status: 404
            });
          }
          const headers = new Headers();
          maybeObj.writeHttpMetadata(headers);
          return new Response(body, {
            headers
          });
        }
        case 'POST': {
          const multipartUpload = await env.BUCKET.createMultipartUpload(filename, {
            httpMetadata: req.headers,
            ssecKey: SSEC_KEY,
          });
          /**
           * This example only provides a single-part "multipart" upload.
           * For multiple parts, the process is the same(the key must be provided)
           * for every part.
          */
          const partOne = await multipartUpload.uploadPart(1, req.body, ssecKey);
          const obj = await multipartUpload.complete([partOne]);
          const headers = new Headers();
          obj.writeHttpMetadata(headers);
          return new Response(null, {
            headers,
            status: 201
          });
        }
        case 'PUT': {
          const obj = await env.BUCKET.put(filename, req.body, {
            httpMetadata: req.headers,
            ssecKey: SSEC_KEY,
          });
          const headers = new Headers();
          maybeObj.writeHttpMetadata(headers);
          return new Response(null, {
            headers,
            status: 201
          });
        }
        default: {
          return new Response("Method not allowed", {
            status: 405
          });
        }
      }
    }
  }
  javascript
  /**
     * In this example, your SSE-C is stored as a hexadecimal string(preferably a secret).
     * The R2 API also supports providing an ArrayBuffer directly, if you want to generate/
     * store your keys dynamically.
  */
  export default {
    async fetch(req, env) {
      const { SSEC_KEY, R2 } = env;
      const { pathname: filename } = new URL(req.url);
      switch(req.method) {
        case "GET": {
          const maybeObj = await env.BUCKET.get(filename, {
            onlyIf: req.headers,
            ssecKey: SSEC_KEY,
          });
          if(!maybeObj) {
            return new Response("Not Found", {
              status: 404
            });
          }
          const headers = new Headers();
          maybeObj.writeHttpMetadata(headers);
          return new Response(body, {
            headers
          });
        }
        case 'POST': {
          const multipartUpload = await env.BUCKET.createMultipartUpload(filename, {
            httpMetadata: req.headers,
            ssecKey: SSEC_KEY,
          });
          /**
           * This example only provides a single-part "multipart" upload.
           * For multiple parts, the process is the same(the key must be provided)
           * for every part.
          */
          const partOne = await multipartUpload.uploadPart(1, req.body, ssecKey);
          const obj = await multipartUpload.complete([partOne]);
          const headers = new Headers();
          obj.writeHttpMetadata(headers);
          return new Response(null, {
            headers,
            status: 201
          });
        }
        case 'PUT': {
          const obj = await env.BUCKET.put(filename, req.body, {
            httpMetadata: req.headers,
            ssecKey: SSEC_KEY,
          });
          const headers = new Headers();
          maybeObj.writeHttpMetadata(headers);
          return new Response(null, {
            headers,
            status: 201
          });
        }
        default: {
          return new Response("Method not allowed", {
            status: 405
          });
        }
      }
    }
  }
  typescript
  import {
    UploadPartCommand,
    PutObjectCommand, S3Client,
    CompleteMultipartUploadCommand,
    CreateMultipartUploadCommand,
    type UploadPartCommandOutput
  } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });

const SSECustomerAlgorithm = "AES256";
  const SSECustomerKey = process.env.R2_SSEC_KEY;
  const SSECustomerKeyMD5 = process.env.R2_SSEC_KEY_MD5;

await s3.send(
    new PutObjectCommand({
      Bucket: "your-bucket",
      Key: "single-part",
      Body: "BeepBoop",
      SSECustomerAlgorithm,
      SSECustomerKey,
      SSECustomerKeyMD5,
    }),
  );

const multi = await s3.send(
    new CreateMultipartUploadCommand({
      Bucket: "your-bucket",
      Key: "multi-part",
      SSECustomerAlgorithm,
      SSECustomerKey,
      SSECustomerKeyMD5,
    }),
  );
  const UploadId = multi.UploadId;

const parts: UploadPartCommandOutput[] = [];

parts.push(
    await s3.send(
      new UploadPartCommand({
        Bucket: "your-bucket",
        Key: "multi-part",
        UploadId,
        //   filledBuf()` generates some random data.
        // Replace with a function/body of your choice.
        Body: filledBuf(),
        PartNumber: 1,
        SSECustomerAlgorithm,
        SSECustomerKey,
        SSECustomerKeyMD5,
      }),
    ),
  );
  parts.push(
    await s3.send(
      new UploadPartCommand({
        Bucket: "your-bucket",
        Key: "multi-part",
        UploadId,
        //   filledBuf()` generates some random data.
        // Replace with a function/body of your choice.
        Body: filledBuf(),
        PartNumber: 2,
        SSECustomerAlgorithm,
        SSECustomerKey,
        SSECustomerKeyMD5,
      }),
    ),
  );
  await s3.send(
    new CompleteMultipartUploadCommand({
      Bucket: "your-bucket",
      Key: "multi-part",
      UploadId,
      MultipartUpload: {
        Parts: parts.map(({ ETag }, PartNumber) => ({
          ETag,
          PartNumber: PartNumber + 1,
        })),
      },
      SSECustomerAlgorithm,
      SSECustomerKey,
      SSECustomerKeyMD5,
    }),
  );

const HeadObjectOutput = await s3.send(
    new HeadObjectCommand({
      Bucket: "your-bucket",
      Key: "multi-part",
      SSECustomerAlgorithm,
      SSECustomerKey,
      SSECustomerKeyMD5,
    }),
  );

const GetObjectOutput = await s3.send(
    new GetObjectCommand({
      Bucket: "your-bucket",
      Key: "single-part",
      SSECustomerAlgorithm,
      SSECustomerKey,
      SSECustomerKeyMD5,
    }),
  );
  hcl
terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "~> 4"
    }
  }
}

provider "cloudflare" {
  api_token = "<YOUR_API_TOKEN>"
}

resource "cloudflare_r2_bucket" "cloudflare-bucket" {
  account_id = "<YOUR_ACCOUNT_ID>"
  name       = "my-tf-test-bucket"
  location   = "WEUR"
}
hcl
terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 5"
    }
  }
}

provider "aws" {
  region = "us-east-1"

access_key = <R2 Access Key>
  secret_key = <R2 Secret Key>

# Required for R2.
  # These options disable S3-specific validation on the client (Terraform) side.
  skip_credentials_validation = true
  skip_region_validation      = true
  skip_requesting_account_id  = true

endpoints {
    s3 = "https://<account id>.r2.cloudflarestorage.com"
  }
}

resource "aws_s3_bucket" "default" {
  bucket = "<org>-test"
}

resource "aws_s3_bucket_cors_configuration" "default" {
  bucket   = aws_s3_bucket.default.id

cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "default" {
  bucket = aws_s3_bucket.default.id

rule {
    id     = "expire-bucket"
    status = "Enabled"
    expiration {
      days = 1
    }
  }

rule {
    id     = "abort-multipart-upload"
    status = "Enabled"
    abort_incomplete_multipart_upload {
      days_after_initiation = 1
    }
  }
}
ts
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const object = await env.MY_BUCKET.get("image.png");
    return new Response(object.body);
  },
} satisfies ExportedHandler<Env>;
ts
  import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const S3 = new S3Client({
    region: "auto", // Required by SDK but not used by R2
    // Provide your Cloudflare account ID
    endpoint: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`,
    // Retrieve your S3 API credentials for your R2 bucket via API tokens (see: https://developers.cloudflare.com/r2/api/tokens)
    credentials: {
      accessKeyId: '<ACCESS_KEY_ID>',
      secretAccessKey: '<SECRET_ACCESS_KEY>',
    },
  });

const response = await S3.send(
    new GetObjectCommand({
      Bucket: "my-bucket",
      Key: "image.png",
    }),
  );
  python
  import boto3

s3 = boto3.client(
    service_name="s3",
    # Provide your Cloudflare account ID
    endpoint_url=f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com",
    # Retrieve your S3 API credentials for your R2 bucket via API tokens (see: https://developers.cloudflare.com/r2/api/tokens)
    aws_access_key_id=ACCESS_KEY_ID,
    aws_secret_access_key=SECRET_ACCESS_KEY,
    region_name="auto", # Required by SDK but not used by R2
  )

response = s3.get_object(Bucket="my-bucket", Key="image.png")
  image_data = response["Body"].read()
  sh
wrangler r2 object get test-bucket/image.png
ts
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    await env.MY_BUCKET.delete("image.png");
    return new Response("Deleted");
  },
} satisfies ExportedHandler<Env>;
ts
  import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const S3 = new S3Client({
    region: "auto", // Required by SDK but not used by R2
    // Provide your Cloudflare account ID
    endpoint: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`,
    // Retrieve your S3 API credentials for your R2 bucket via API tokens (see: https://developers.cloudflare.com/r2/api/tokens)
    credentials: {
      accessKeyId: '<ACCESS_KEY_ID>',
      secretAccessKey: '<SECRET_ACCESS_KEY>',
    },
  });

await S3.send(
    new DeleteObjectCommand({
      Bucket: "my-bucket",
      Key: "image.png",
    }),
  );
  python
  import boto3

s3 = boto3.client(
    service_name="s3",
    # Provide your Cloudflare account ID
    endpoint_url=f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com",
    # Retrieve your S3 API credentials for your R2 bucket via API tokens (see: https://developers.cloudflare.com/r2/api/tokens)
    aws_access_key_id=ACCESS_KEY_ID,
    aws_secret_access_key=SECRET_ACCESS_KEY,
    region_name="auto", # Required by SDK but not used by R2
  )

s3.delete_object(Bucket="my-bucket", Key="image.png")
  sh
wrangler r2 object delete test-bucket/image.png
plaintext
echo -n $(echo -n bce6bf66aeb76c7040fdd5f4eccb78e6 | xxd -r -p -)\
$(echo -n 8165449fc15bbf43d3b674595cbcc406 | xxd -r -p -) | md5sum
ts
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    await env.MY_BUCKET.put("image.png", request.body);
    return new Response("Uploaded");
  },
} satisfies ExportedHandler<Env>;
ts
  import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const S3 = new S3Client({
    region: "auto", // Required by SDK but not used by R2
    // Provide your Cloudflare account ID
    endpoint: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`,
    // Retrieve your S3 API credentials for your R2 bucket via API tokens (see: https://developers.cloudflare.com/r2/api/tokens)
    credentials: {
      accessKeyId: '<ACCESS_KEY_ID>',
      secretAccessKey: '<SECRET_ACCESS_KEY>',
    },
  });

await S3.send(
    new PutObjectCommand({
      Bucket: "my-bucket",
      Key: "image.png",
      Body: fileContent,
    }),
  );
  python
  import boto3

s3 = boto3.client(
    service_name="s3",
    # Provide your Cloudflare account ID
    endpoint_url=f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com",
    # Retrieve your S3 API credentials for your R2 bucket via API tokens (see: https://developers.cloudflare.com/r2/api/tokens)
    aws_access_key_id=ACCESS_KEY_ID,
    aws_secret_access_key=SECRET_ACCESS_KEY,
    region_name="auto", # Required by SDK but not used by R2
  )

s3.put_object(Bucket="my-bucket", Key="image.png", Body=file_content)
  sh

**Examples:**

Example 1 (unknown):
```unknown
</page>

<page>
---
title: Use SSE-C · Cloudflare R2 docs
description: The following tutorial shows some snippets for how to use
  Server-Side Encryption with Customer-Provided Keys (SSE-C) on Cloudflare R2.
lastUpdated: 2025-10-09T15:47:46.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/r2/examples/ssec/
  md: https://developers.cloudflare.com/r2/examples/ssec/index.md
---

The following tutorial shows some snippets for how to use Server-Side Encryption with Customer-Provided Keys (SSE-C) on R2.

## Before you begin

* When using SSE-C, make sure you store your encryption key(s) in a safe place. In the event you misplace them, Cloudflare will be unable to recover the body of any objects encrypted using those keys.
* While SSE-C does provide MD5 hashes, this hash can be used for identification of keys only. The MD5 hash is not used in the encryption process itself.

## Workers

* TypeScript
```

Example 2 (unknown):
```unknown
* JavaScript
```

Example 3 (unknown):
```unknown
## S3-API

* @aws-sdk/client-s3
```

Example 4 (unknown):
```unknown
</page>

<page>
---
title: S3 SDKs · Cloudflare R2 docs
lastUpdated: 2024-09-29T02:09:56.000Z
chatbotDeprioritize: true
source_url:
  html: https://developers.cloudflare.com/r2/examples/aws/
  md: https://developers.cloudflare.com/r2/examples/aws/index.md
---

* [aws CLI](https://developers.cloudflare.com/r2/examples/aws/aws-cli/)
* [aws-sdk-go](https://developers.cloudflare.com/r2/examples/aws/aws-sdk-go/)
* [aws-sdk-java](https://developers.cloudflare.com/r2/examples/aws/aws-sdk-java/)
* [aws-sdk-js](https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js/)
* [aws-sdk-js-v3](https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/)
* [aws-sdk-net](https://developers.cloudflare.com/r2/examples/aws/aws-sdk-net/)
* [aws-sdk-php](https://developers.cloudflare.com/r2/examples/aws/aws-sdk-php/)
* [aws-sdk-ruby](https://developers.cloudflare.com/r2/examples/aws/aws-sdk-ruby/)
* [aws-sdk-rust](https://developers.cloudflare.com/r2/examples/aws/aws-sdk-rust/)
* [aws4fetch](https://developers.cloudflare.com/r2/examples/aws/aws4fetch/)
* [boto3](https://developers.cloudflare.com/r2/examples/aws/boto3/)
* [Configure custom headers](https://developers.cloudflare.com/r2/examples/aws/custom-header/)

</page>

<page>
---
title: Terraform · Cloudflare R2 docs
description: You must generate an Access Key before getting started. All
  examples will utilize access_key_id and access_key_secret variables which
  represent the Access Key ID and Secret Access Key values you generated.
lastUpdated: 2025-08-20T18:25:25.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/r2/examples/terraform/
  md: https://developers.cloudflare.com/r2/examples/terraform/index.md
---

You must [generate an Access Key](https://developers.cloudflare.com/r2/api/tokens/) before getting started. All examples will utilize `access_key_id` and `access_key_secret` variables which represent the **Access Key ID** and **Secret Access Key** values you generated.



This example shows how to configure R2 with Terraform using the [Cloudflare provider](https://github.com/cloudflare/terraform-provider-cloudflare).

Note for using AWS provider

When using the Cloudflare Terraform provider, you can only manage buckets. To configure items such as CORS and object lifecycles, you will need to use the [AWS Provider](https://developers.cloudflare.com/r2/examples/terraform-aws/).

With [`terraform`](https://developer.hashicorp.com/terraform/downloads) installed, create `main.tf` and copy the content below replacing with your API Token.
```

---

## Create startup script that mounts bucket

**URL:** llms-txt#create-startup-script-that-mounts-bucket

RUN printf '#!/bin/sh\n\
    set -e\n\
    mkdir -p /mnt/r2\n\
    R2_ENDPOINT="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"\n\
    /usr/local/bin/tigrisfs --endpoint "${R2_ENDPOINT}" -f "${BUCKET_NAME}" /mnt/r2 &\n\
    sleep 3\n\
    ls -lah /mnt/r2\n\
    ' > /startup.sh && chmod +x /startup.sh

CMD ["/startup.sh"]
```

See the [Mount R2 buckets with FUSE](https://developers.cloudflare.com/containers/examples/r2-fuse-mount/) example for a complete guide on mounting R2 buckets and/or other S3-compatible storage buckets within your containers.

<page>
---
title: New CPU Pricing for Containers and Sandboxes · Changelog
description: New Container pricing changes CPU billing to be based on active
  usage, rather than provisioned CPU resources
chatbotDeprioritize: true
source_url:
  html: https://developers.cloudflare.com/changelog/2025-11-21-new-cpu-pricing/
  md: https://developers.cloudflare.com/changelog/2025-11-21-new-cpu-pricing/index.md
---

---

## Check if requests to a specific endpoint contain any content objects larger than 500 KB (512,000 bytes)

**URL:** llms-txt#check-if-requests-to-a-specific-endpoint-contain-any-content-objects-larger-than-500-kb-(512,000-bytes)

any(cf.waf.content_scan.obj_sizes[*] > 512000) and http.request.uri.path eq "/upload"
```

<page>
---
title: cf.waf.content_scan.obj_types · Cloudflare Ruleset Engine docs
description: An array of file types in the order the content objects were
  detected in the request.
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ruleset-engine/rules-language/fields/reference/cf.waf.content_scan.obj_types/
  md: https://developers.cloudflare.com/ruleset-engine/rules-language/fields/reference/cf.waf.content_scan.obj_types/index.md
---

---

## "Buckets": [

**URL:** llms-txt#"buckets":-[

---
