# Cloudflare-Pulumi - Getting Started

**Pages:** 16

---

## being enforced, the script will only check to see if the app is installed or not.

**URL:** llms-txt#being-enforced,-the-script-will-only-check-to-see-if-the-app-is-installed-or-not.

###################################################################################################

---

## there is no need to define an application path. The app must either install in the

**URL:** llms-txt#there-is-no-need-to-define-an-application-path.-the-app-must-either-install-in-the

---

## Install system packages

**URL:** llms-txt#install-system-packages

**Contents:**
- Custom startup scripts

RUN apt-get update && apt-get install -y \
    postgresql-client \
    redis-tools \
    && rm -rf /var/lib/apt/lists/*
jsonc
{
  "containers": [
    {
      "class_name": "Sandbox",
      "image": "./Dockerfile",
    },
  ],
}
dockerfile
FROM docker.io/cloudflare/sandbox:0.3.3

COPY my-app.js /workspace/my-app.js
COPY startup.sh /workspace/startup.sh
RUN chmod +x /workspace/startup.sh
CMD ["/workspace/startup.sh"]
bash
#!/bin/bash

**Examples:**

Example 1 (unknown):
```unknown
Update `wrangler.jsonc` to reference your Dockerfile:
```

Example 2 (unknown):
```unknown
When you run `wrangler dev` or `wrangler deploy`, Wrangler automatically builds your Docker image and pushes it to Cloudflare's container registry. You don't need to manually build or publish images.

## Custom startup scripts

Run services automatically when the container starts by creating a custom startup script:
```

Example 3 (unknown):
```unknown

```

---

## This should output your current Turso CLI version (your installed version may be higher):

**URL:** llms-txt#this-should-output-your-current-turso-cli-version-(your-installed-version-may-be-higher):

**Contents:**
- Create and populate a database

turso version v0.51.0
sh
turso auth login
sh
Waiting for authentication...
✔  Success! Logged in as <your GitHub username>
sh
turso db create my-db
sh

**Examples:**

Example 1 (unknown):
```unknown
## Create and populate a database

Before you create your first Turso database, you need to log in to the CLI using your GitHub account by running:
```

Example 2 (unknown):
```unknown

```

Example 3 (unknown):
```unknown
`turso auth login` will open a browser window and ask you to sign into your GitHub account, if you are not already logged in. The first time you do this, you will need to give the Turso application permission to use your account. Select **Approve** to grant Turso the permissions needed.

After you have authenticated, you can create a database by running `turso db create <DATABASE_NAME>`. Turso will automatically choose a location closest to you.
```

Example 4 (unknown):
```unknown

```

---

## install gokeyless

**URL:** llms-txt#install-gokeyless

**Contents:**
  - Configure
  - Populate keys
  - Activate
  - Allow incoming connections from Cloudflare
- Before you start
- 1. Import the public and private key to the HSM
- 2. Modify the gokeyless config file and restart the service
- Before you start
- 1. Create, assign, and initialize a new partition
- 2. Generate a RSA key pair and certificate signing request (CSR)

sudo apt-get update && sudo apt-get install gokeyless
sh
sudo yum makecache
sudo yum-config-manager --add-repo https://pkg.cloudflare.com/gokeyless.repo && sudo yum-config-manager --setopt=gokeyless-stable.gpgkey=https://pkg.cloudflare.com/cloudflare-ascii-pubkey.gpg --save
sudo yum install gokeyless
sh
sudo dnf install dnf-plugins-core && dnf clean all
sudo dnf config-manager --add-repo https://pkg.cloudflare.com/gokeyless.repo
sudo dnf install gokeyless
sh
ls -l /etc/keyless/keys
sh
-r-------- 1 keyless keyless 1675 Nov 18 16:44 example.com.key
txt
keyserver$ openssl x509 -pubkey -noout -in certificate.pem > pubkey.pem
txt
keyserver$ /opt/cloudhsm/bin/key_mgmt_util
Command: loginHSM -u CU -s patrick -p donahue
Command: genSymKey -t 31 -s 16 -sess -l import-wrapping-key
...
Symmetric Key Created.  Key Handle: 658
...
txt
Command: importPrivateKey -f privkey.pem -l mykey -id 1 -w 658
...
Cfm3WrapHostKey returned: 0x00 : HSM Return: SUCCESS
Cfm3CreateUnwrapTemplate returned: 0x00 : HSM Return: SUCCESS
Cfm3UnWrapKey returned: 0x00 : HSM Return: SUCCESS
...
Private Key Unwrapped.  Key Handle: 658

Command: importPubKey -f pubkey.pem -l mykey -id 1
Cfm3CreatePublicKey returned: 0x00 : HSM Return: SUCCESS
...
Public Key Handle: 941

Command: logoutHSM
Command: exit
yaml
private_key_stores:
  - dir: /etc/keyless/keys
yaml
- uri: pkcs11:token=cavium;object=mykey?module-path=/opt/cloudhsm/lib/libcloudhsm_pkcs11_standard.so&pin-value=patrick:donahue&max-sessions=1
sh
sudo systemctl restart gokeyless.service
sudo systemctl status gokeyless.service -l
txt
vm$ ssh tenantadmin@hsm

[local_host] lunash:>hsm login
  Please enter the HSM Administrators' password:
  > ********

'hsm login' successful.

Command Result : 0 (Success)

[local_host] lunash:>partition create -partition KeylessSSL

Type 'proceed' to create the partition, or
          'quit' to quit now.
          > proceed
'partition create' successful.

Command Result : 0 (Success)
bash
[local_host] lunash:>client assignpartition -client azure-keyless -partition KeylessSSL

'client assignPartition' successful.

Command Result : 0 (Success)
txt
vm$ lunacm
lunacm (64-bit) v7.2.0-220. Copyright (c) 2018 SafeNet. All rights reserved.

Slot Id ->              0
  Label ->
  Serial Number ->        XXXXXXXXXXXXX
  Model ->                LunaSA 7.2.0
  Firmware Version ->     7.0.3
  Configuration ->        Luna User Partition With SO (PW) Signing With Cloning Mode
  Slot Description ->     Net Token Slot

lunacm:>partition init -label KeylessSSL -domain cloudflare

Enter password for Partition SO: ********

Re-enter password for Partition SO: ********

You are about to initialize the partition.
  All contents of the partition will be destroyed.

Are you sure you wish to continue?

Type 'proceed' to continue, or 'quit' to quit now ->proceed

Command Result : No Error
txt

**Examples:**

Example 1 (unknown):
```unknown
#### RHEL/CentOS packages

Use either of the following examples to install the `gokeyless` package for RHEL or CentOS.

**Option 1**
```

Example 2 (unknown):
```unknown
**Option 2**
```

Example 3 (unknown):
```unknown
Note

Amazon Linux customers may need to update their final installation command to be something similar to `sudo yum install rsyslog shadow-utils && sudo yum install gokeyless`.

### Configure

Add your Cloudflare account details to the configuration file located at `/etc/keyless/gokeyless.yaml`:

1. Set the hostname of the key server, for example, `11aa40b4a5db06d4889e48e2f.example.com`. This is also the value you entered when you uploaded your keyless certificate and is the hostname of your key server that holds the key for this certificate.
2. Set the Zone ID (found on **Overview** tab of the Cloudflare dashboard).
3. [Set the Origin CA API key](https://developers.cloudflare.com/fundamentals/api/get-started/ca-keys).

### Populate keys

Install your private keys in `/etc/keyless/keys/` and set the user and group to keyless with 400 permissions. Keys must be in PEM or DER format and have an extension of `.key`:
```

Example 4 (unknown):
```unknown

```

---

## Manual scripted installation

**URL:** llms-txt#manual-scripted-installation

curl -sSfL <https://get.tur.so/install.sh> | bash
sh
turso --version
sh

**Examples:**

Example 1 (unknown):
```unknown
After you have installed the Turso CLI, verify that the CLI is in your shell path:
```

Example 2 (unknown):
```unknown

```

---

## Install FUSE and dependencies

**URL:** llms-txt#install-fuse-and-dependencies

RUN apk add --no-cache \
    --repository http://dl-cdn.alpinelinux.org/alpine/v3.20/main \
    ca-certificates fuse curl bash

---

## Install additional Python packages

**URL:** llms-txt#install-additional-python-packages

RUN pip install --no-cache-dir \
    scikit-learn==1.3.0 \
    tensorflow==2.13.0 \
    transformers==4.30.0

---

## running the installer. If the profile is not found, this audit and enforce script will exit 00

**URL:** llms-txt#running-the-installer.-if-the-profile-is-not-found,-this-audit-and-enforce-script-will-exit-00

---

## Install it

**URL:** llms-txt#install-it

$ npm create cloudflare@latest agents-starter -- --template="cloudflare/agents-starter"

---

## Install the new package

**URL:** llms-txt#install-the-new-package

**Examples:**

Example 1 (unknown):
```unknown

```

---

## Make sure that the application matches the name of the app that will be installed.

**URL:** llms-txt#make-sure-that-the-application-matches-the-name-of-the-app-that-will-be-installed.

---

## Install tigrisfs

**URL:** llms-txt#install-tigrisfs

RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then ARCH="amd64"; fi && \
    if [ "$ARCH" = "aarch64" ]; then ARCH="arm64"; fi && \
    VERSION=$(curl -s https://api.github.com/repos/tigrisdata/tigrisfs/releases/latest | grep -o '"tag_name": "[^"]*' | cut -d'"' -f4) && \
    curl -L "https://github.com/tigrisdata/tigrisfs/releases/download/${VERSION}/tigrisfs_${VERSION#v}_linux_${ARCH}.tar.gz" -o /tmp/tigrisfs.tar.gz && \
    tar -xzf /tmp/tigrisfs.tar.gz -C /usr/local/bin/ && \
    rm /tmp/tigrisfs.tar.gz && \
    chmod +x /usr/local/bin/tigrisfs

---

## Install Node.js packages globally

**URL:** llms-txt#install-node.js-packages-globally

RUN npm install -g typescript ts-node prettier

---

## Get started

**URL:** llms-txt#get-started

**Contents:**
- Before you begin
- 1. Step description
- 2. Steps until you get to activation
- Next steps
- Example
- Purpose
- Tone
- content\_type
- Structure
  - Required components

All the things you need to do before you start configuring your product, both within Cloudflare and outside.

## 1. Step description

## 2. Steps until you get to activation

Point to more complex setup options.
yaml
pcx_content_type: how-to
plaintext
---
weight: xx
pcx_content_type: how-to
---

**Examples:**

Example 1 (unknown):
```unknown
## Example

[Waiting Room: Get started](https://developers.cloudflare.com/waiting-room/get-started/)

</page>

<page>
---
title: How to · Cloudflare Style Guide
description: The purpose of a how to is to explain how to complete a task within
  the product.
lastUpdated: 2025-08-20T21:45:15.000Z
chatbotDeprioritize: true
source_url:
  html: https://developers.cloudflare.com/style-guide/documentation-content-strategy/content-types/how-to/
  md: https://developers.cloudflare.com/style-guide/documentation-content-strategy/content-types/how-to/index.md
---

## Purpose

The purpose of a how to is to explain how to complete a task within the product.

Note

If you are unsure about when to categorize something as a how-to or tutorial, remember:

Tutorials are typically longer form and contain multiple steps, usually involving multiple products, and help users connect products to real-world scenarios.

A how-to helps a user complete a singular task within a single product.

## Tone

instructional, straightforward

## content\_type
```

Example 2 (unknown):
```unknown
For more details, refer to [`pcx_content_type`](https://developers.cloudflare.com/style-guide/frontmatter/custom-properties/#pcx_content_type).

## Structure

### Required components

[**Title**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/titles/): Short verb phrase in second-person imperative. Do not use gerund phrases.

[**Steps**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/steps-tasks-procedures/): Numbered steps that complete a task.

[**Next steps**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/next-steps/): What users should see as the end result of the steps and/or actionable next steps.

### Optional components

[**Context**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/context/): An introductory paragraph on the following steps and what they will accomplish.

Provide context to the reader that is not in the section heading.

End with a colon or a period. Use a colon if it immediately precedes the steps. Use a period if there is more material (such as a note) between the context and the procedure.

Do not provide context for steps with a partial sentence that is completed by the numbered steps.

[**Prerequisites**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/prerequisites/): Tasks or conditions that must be completed before a user can complete a series of steps.

[**Notes/warnings**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/notes-tips-warnings/)

[**Examples**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/examples/)

**Screenshots**

[**Related links**](https://developers.cloudflare.com/style-guide/documentation-content-strategy/component-attributes/links/): Bulleted list of links to associated resources.

## Template

Single procedure how-to
```

---

## Install

**URL:** llms-txt#install

**Contents:**
- Windows
- macOS
- iOS
- Android
- Windows
  - Deploy the WARP client
  - Update MDM parameters
- macOS
  - Prerequisites
  - Deployment order

sudo apt-get -y update && sudo apt-get -y install cloudflare-warp
python
   <# Choose file name for downloading application #>
   $filename = filename.msi'

<# Download URL of the installer. #>
   $url = 'https://downloads.cloudflareclient.com/v1/download/windows/ga'
   Write-Host 'Downloading App from' $url
   Invoke-WebRequest -Uri $url -OutFile $filename

<# Run the installer and wait for the installation to finish #>
   $arguments = "ORGANIZATION="exampleorg" SERVICE_MODE="warp" GATEWAY_UNIQUE_ID="fmxk762nrj" SUPPORT_URL="http://support.example.com""

$installProcess = (Start-Process $filename -ArgumentList $arguments -PassThru -Wait)

<# Check if installation was successful #>
   if ($installProcess.ExitCode -ne 0) {
       Write-Host "Installation failed!"
       exit $installProcess.ExitCode
   }
   else {
       Write-Host "Installation completed successfully!"
   }
   xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0">
   <dict>
   <key>organization</key>
   <string>organizationname</string>
   <key>auto_connect</key>
   <integer>1</integer>
   <key>switch_locked</key>
   <false />
   <key>service_mode</key>
   <string>warp</string>
   <key>support_url</key>
   <string>https://support.example.com</string>
   </dict>
   </plist>
   xml
   <dict>
   <key>organization</key>
   <string>yourorganization</string>
   <key>auto_connect</key>
   <integer>1</integer>
   <key>switch_locked</key>
   <false />
   <key>service_mode</key>
   <string>warp</string>
   <key>support_url</key
   <string>https://support.example.com</string>
   </dict>
   txt
/qn ORGANIZATION="your-team-name" SUPPORT_URL="http://support.example.com"
powershell
   # Define the path to the file
   $filePath = "C:\ProgramData\Cloudflare\mdm.xml"

# Create the XML content as a string
   $xmlContent = @"
   <dict>
     <key>multi_user</key>
     <true/>
     <key>pre_login</key>
     <dict>
       <key>organization</key>
       <string>mycompany</string>
       <key>auth_client_id</key>
       <string>88bf3b6d86161464f6509f7219099e57.access</string>
       <key>auth_client_secret</key>
       <string>bdd31cbc4dec990953e39163fbbb194c93313ca9f0a6e420346af9d326b1d2a5</string>
     </dict>
     <key>configs</key>
     <array>
       <dict>
         <key>organization</key>
         <string>mycompany</string>
         <key>display_name</key>
         <string>Production environment</string>
       </dict>
       <dict>
         <key>organization</key>
         <string>test-org</string>
         <key>display_name</key>
         <string>Test environment</string>
       </dict>
     </array>
   </dict>
   "@

# Ensure the directory exists
   $directory = Split-Path $filePath -parent
   if (-not (Test-Path $directory)) {
     New-Item -ItemType Directory -Path $directory | Out-Null
   }

# Write the XML content to the file
   try {
     $xmlContent | Out-File -Encoding UTF8 -FilePath $filePath
     Write-Host "mdm.xml file created successfully at: $filePath"
   }
   catch {
     Write-Error "Failed to create mdm.xml file: $_"
   }
   xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0">
       <dict>
           <key>PayloadDisplayName</key>
           <string>Cloudflare WARP</string>
           <key>PayloadIdentifier</key>
           <string>cloudflare_warp</string>
           <key>PayloadOrganization</key>
           <string>Cloudflare, Ltd.</string>
           <key>PayloadRemovalDisallowed</key>
           <false/>
           <key>PayloadType</key>
           <string>Configuration</string>
           <key>PayloadScope</key>
           <string>System</string>
           <key>PayloadUUID</key>
           <string>YOUR_PAYLOAD_UUID_HERE</string>
           <key>PayloadVersion</key>
           <integer>1</integer>
           <key>PayloadContent</key>
           <array>
               <dict>
                   <key>organization</key>
                   <string>YOUR_TEAM_NAME_HERE</string>
                   <key>auto_connect</key>
                   <integer>120</integer>
                   <key>onboarding</key>
                   <false/>
                   <key>PayloadDisplayName</key>
                   <string>Warp Configuration</string>
                   <key>PayloadIdentifier</key>
                   <string>com.cloudflare.warp.YOUR_PAYLOAD_UUID_HERE</string>
                   <key>PayloadOrganization</key>
                   <string>Cloudflare Ltd.</string>
                   <key>PayloadType</key>
                   <string>com.cloudflare.warp</string>
                   <key>PayloadUUID</key>
                   <string>YOUR_PAYLOAD_UUID_HERE</string>
                   <key>PayloadVersion</key>
                   <integer>1</integer>
               </dict>
           </array>
       </dict>
   </plist>
   xml
   <array>
     <dict>
         <key>organization</key>
         <string>YOUR_TEAM_NAME_HERE</string>
         // add desired deployment parameters here
   xml
   <dict>
     <key>organization</key>
     <string>YOUR_TEAM_NAME_HERE</string>
     <key>auto_connect</key>
     <integer>1</integer>
   </dict>
   json
    {
      "kind": "androidenterprise#managedConfiguration",
      "productId": "app:com.cloudflare.cloudflareoneagent",
      "managedProperty": [
        {
          "key": "app_config_bundle_list",
          "valueBundleArray": [
            {
              "managedProperty": [
                {
                  "key": "organization",
                  "valueString": "your-team-name"
                },
                {
                  "key": "display_name",
                  "valueString": "Production environment"
                },
                {
                  "key": "service_mode",
                  "valueString": "warp"
                },
                {
                  "key": "onboarding",
                  "valueBool": false
                },
                {
                  "key": "support_url",
                  "valueString": "https://support.example.com/"
                }
              ]
            },
            {
              "managedProperty": [
                {
                  "key": "organization",
                  "valueString": "test-org"
                },
                {
                  "key": "display_name",
                  "valueString": "Test environment"
                }
              ]
            }
          ]
        }
      ]
    }
    sh
        {
        "kind": "androidenterprise#managedConfiguration",
        "productId": "app:com.cloudflare.cloudflareoneagent",
        "managedProperty": [
          {
            "key": "app_config_bundle_list",
            "valueBundleArray": [
              {
                "managedProperty": [
                  {
                    "key": "organization",
                    "valueString": "${ORGANIZATION_NAME-1}"
                  },
                  {
                    "key": "service_mode",
                    "valueString": "warp"
                  },
                  {
                    "key": "onboarding",
                    "valueBool": true
                  },
                  {
                    "key": "display_name",
                    "valueString": "${UNIQUE_DISPLAY_NAME-1}"
                  },
                  {
                    "key": "warp_tunnel_protocol",
                    "valueString": "MASQUE"
                  },
                  {
                    "key": "tunneled_apps",
                    "valueBundleArray" :[
                      {
                        "managedProperty": [
                          {
                            "key": "app_identifier",
                            "valueString": "com.android.chrome" # Application package name/unique bundle identifier for the Chrome app browser
                          },
                          {
                            "key": "is_browser",
                            "valueBool": true
                          }
                        ]
                      },
                      {
                        "managedProperty": [
                          {
                            "key": "app_identifier",
                            "valueString": "com.google.android.gm" # Application package name/unique bundle identifier for the Gmail app
                          },
                          {
                            "key": "is_browser",
                            "valueBool": false # Default value is false, if a user does not define `is_browser` property our app would not treat `app_identifier` package name as a browser.
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "managedProperty": [
                  {
                    "key": "organization",
                    "valueString": "${ORGANIZATION_NAME-1}"
                  },
                  {
                    "key": "service_mode",
                    "valueString": "warp"
                  },
                  {
                    "key": "display_name",
                    "valueString": "${UNIQUE_DISPLAY_NAME-2}"
                  },
                  {
                    "key": "warp_tunnel_protocol",
                    "valueString": "wireguard"
                  }
                ]
              }
            ]
          }
        ]
      }
      python
#!/bin/zsh

###################################################################################################

**Examples:**

Example 1 (unknown):
```unknown
To install WARP on other Linux distributions, refer to the [package repository](https://pkg.cloudflareclient.com/).

</page>

<page>
---
title: Hexnode · Cloudflare One docs
description: Deploy Cloudflare WARP with Hexnode MDM - Step-by-step guide for
  Windows, macOS, iOS, and Android.
lastUpdated: 2025-10-21T14:33:19.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/warp/deployment/mdm-deployment/partners/hexnode/
  md: https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/warp/deployment/mdm-deployment/partners/hexnode/index.md
---

## Windows

1. Create a script file with `.bat`, `.cmd`, and `.ps1` file formats to download, install and configure the Cloudflare WARP client Windows application on the device. Listed below is a sample script with all of the configurable parameters:
```

Example 2 (unknown):
```unknown
2. Push the script file to the devices using Hexnode.

3. On your Hexnode console, go to **Manage** > **Devices**.

4. Select your device name. This will take you to the **Device Summary**.

5. Select **Actions** > **Execute Custom Script**.

6. Choose the script file source as *Upload file*, then upload the script file.

7. Select **Execute**.

After deploying the WARP client, you can check its connection progress using the [Connectivity status](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/warp/troubleshooting/connectivity-status/) messages displayed in the WARP GUI.

## macOS

1. [Download](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/warp/download-warp/#macos) the Cloudflare WARP client for macOS.

2. On your Hexnode console, go to **Apps** > **Add Apps** > **Enterprise App**.

3. Select *macOS* as the app platform.

4. Add an app name, category and description.

5. Upload the `Cloudflare_WARP_<VERSION>.pkg` file and select **Add**.

6. Set up an XML file with the supported app configurations for the app. Here is a sample XML file with the accepted parameters.
```

Example 3 (unknown):
```unknown
7. On your Hexnode console, go to **Policies**.

8. Create a new policy and provide a policy name.

9. Go to **macOS** > **App Management** > **Mandatory Apps** and start setting up the policy.

10. Select **Add** and select the previously uploaded WARP client app.

11. Go to **App Configurations** > **Add new configuration**.

12. Select the *WARP client* app and upload the XML file from Step 6.

13. Now go to **Policy Targets** and associate the policy with the target entities.

This will push the app along with the configurations to the selected devices.

After deploying the WARP client, you can check its connection progress using the [Connectivity status](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/warp/troubleshooting/connectivity-status/) messages displayed in the WARP GUI.

## iOS

1. On your Hexnode console, go to **Apps** > **Add Apps** > **Store App**.

2. Select *iOS* as the app platform.

3. Search for [**Cloudflare One Agent**](https://apps.apple.com/us/app/cloudflare-one-agent/id6443476492) and **Add** the app.

4. Set up an XML file with the supported app configurations for the app. Refer this sample XML code to identify the supported arguments:
```

Example 4 (unknown):
```unknown
5. Upload the app configurations in Hexnode:

   1. On your Hexnode console, go to the **Apps** tab.
   2. Find the Cloudflare One Agent app and select its name.
   3. Select the settings icon and choose **App Configuration**.
   4. Upload the XML file in the corresponding field.
   5. Select **Save**.

6. Push the app to the target devices using Hexnode.

   1. On your Hexnode console, go to **Policies** and create a new policy.
   2. Provide a name for the policy and go to **iOS**.
   3. Go to **Mandatory Apps** > **Configure**.
   4. Select **Add** > **Add app**, check the required app, and select **Done**.
   5. Go to **Policy Targets** and associate the policy with the required target devices.

This will push the app along with the configurations to the selected devices.

After deploying the WARP client, you can check its connection progress using the [Connectivity status](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/warp/troubleshooting/connectivity-status/) messages displayed in the WARP GUI.

## Android

1. On your Hexnode console, go to **Apps** > **Add Apps** > **Managed Google Apps**.
2. Search for the app [**Cloudflare One Agent**](https://play.google.com/store/apps/details?id=com.cloudflare.cloudflareoneagent).
3. Approve the app as a Managed Google Play app.
4. Go to **Policies** and create a new policy.
5. Go to **Android** > **App Configurations** > **Add new configuration**.
6. Find the **Cloudflare One Agent** app and set up your custom configurations.
7. Go to **Policy Targets** and associate the policy with the required target devices.
8. Save the policy.

This will push the app along with the configurations to the selected devices.

After deploying the WARP client, you can check its connection progress using the [Connectivity status](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/warp/troubleshooting/connectivity-status/) messages displayed in the WARP GUI.

</page>

<page>
---
title: Intune · Cloudflare One docs
description: This guide covers how to deploy the Cloudflare WARP client using
  Microsoft Intune.
lastUpdated: 2025-11-27T09:15:53.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/warp/deployment/mdm-deployment/partners/intune/
  md: https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/warp/deployment/mdm-deployment/partners/intune/index.md
---

This guide covers how to deploy the Cloudflare WARP client using Microsoft Intune.

## Windows

### Deploy the WARP client

To deploy WARP on Windows using Intune:

1. [Download the `Cloudflare_WARP_<VERSION>.msi` installer](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/warp/download-warp/#windows).
2. Log in to your Microsoft Intune account.
3. Go to **Apps** > **All Apps** > **Add**.
4. In **App type**, select *Line-of-business app* from the drop-down menu. Select **Select**.
5. Select **Select app package file** and upload the `Cloudflare_WARP_<VERSION>.msi` installer you downloaded previously.
6. Select **OK**.
7. For **Run this script using the logged on credentials**, choose *No*.
8. For **Enforce script signature check**, choose *No*.
9. In the **Name** field, we recommend entering the version number of the package being uploaded.
10. In the **Publisher** field, we recommend entering `Cloudflare, Inc`.
11. In the **Command-line arguments** field, enter a valid installation command. For example:
```

---
