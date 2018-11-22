---
layout: post
title: Let's Encrypt通配符证书开启HTTPS
tags:
  - 技术
  - https
  - Let's Encrypt
abbrlink: 40398
date: 2018-06-12 15:50:50
---

# Let's Encrypt通配符证书开启HTTPS

## 什么是Let's Encrypt?

部署 HTTPS 网站的时候需要证书，证书由 CA 机构签发，大部分传统 CA 机构签发证书是需要收费的，这不利于推动 HTTPS 协议的使用。

Let's Encrypt 也是一个 CA 机构，但这个 CA 机构是免费的！也就是说签发证书不需要任何费用。

## 什么是通配符证书

在没有出现通配符证书之前，Let's Encrypt 支持两种证书。

1）单域名证书：证书仅仅包含一个主机。

2）SAN 证书：一张证书可以包括多个主机（Let's Encrypt 限制是 20），也就是证书可以包含下列的主机：www.example.com、www.example.cn、blog.example.com 等等。

证书包含的主机可以不是同一个注册域，不要问我注册域是什么？注册域就是向域名注册商购买的域名。

对于个人用户来说，由于主机并不是太多，所以使用 SAN 证书完全没有问题，但是对于大公司来说有一些问题：

子域名非常多，而且过一段时间可能就要使用一个新的主机。

注册域也非常多。

读者可以思考下，对于大企业来说，SAN 证书可能并不能满足需求，类似于 sina 这样的网站，所有的主机全部包含在一张证书中，而使用 Let's Encrypt 证书是无法满足的。

## Let's Encrypt 通配符证书

通配符证书就是证书中可以包含一个通配符，比如 .example.com、.example.cn，读者很快明白，大型企业也可以使用通配符证书了，一张证书可以防止更多的主机了。

这个功能可以说非常重要，从功能上看 Let's Encrypt 和传统 CA 机构没有什么区别了，会不会触动传统 CA 机构的利益呢？

## 如何申请Let’s Encrypt通配符证书

为了实现通配符证书，Let's Encrypt 对 ACME 协议的实现进行了升级，只有 v2 协议才能支持通配符证书。

也就是说任何客户端只要支持 ACME v2 版本，就可以申请通配符证书了，是不是很激动。

读者可以查看下自己惯用的客户端是不是支持 ACME v2 版本，官方介绍 Certbot 0.22.0 版本支持新的协议版本，我立刻进行了升级：
```
./certbot-auto -V
Upgrading certbot-auto 0.21.1 to 0.22.0...
Replacing certbot-auto...

./certbot-auto -V
certbot 0.22.0
```
在了解该协议之前有几个注意点：

1）客户在申请 Let's Encrypt 证书的时候，需要校验域名的所有权，证明操作者有权利为该域名申请证书，目前支持三种验证方式：

dns-01：给域名添加一个 DNS TXT 记录。

http-01：在域名对应的 Web 服务器下放置一个 HTTP well-known URL 资源文件。

tls-sni-01：在域名对应的 Web 服务器下放置一个 HTTPS well-known URL 资源文件。

而申请通配符证书，只能使用 dns-01 的方式。

2）ACME v2 和 v1 协议是互相不兼容的，为了使用 v2 版本，客户端需要创建另外一个账户（代表客户端操作者），以 Certbot 客户端为例，大家可以查看：
```
$ tree /etc/letsencrypt/accounts
.
├── acme-staging.api.letsencrypt.org
└── acme-v01.api.letsencrypt.org
```
3）Enumerable Orders 和限制

为了实现通配符证书，Let's Encrypt 在申请者身份校验上做了很大的改变。

有了订单 ID 的概念，主要是为了追踪通配符域名。

申请限制，在 V1 版本，Let's Encrypt 为了避免滥操作，对申请证书有一些限制（很难学习，但是正常使用不会遇到该限制）。而 v2 版本，对于通配符证书，多了一个限制，New Orders per Account（每个证书订单数限制）。

这两个细节，后续再仔细研究。

## 实践测试
我迫不及待想使用 Certbot 申请通配符证书，升级 Certbot 版本运行下列命令：

```
$ certbot-auto certonly  -d *.newyingyong.cn --manual --preferred-challenges dns

Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator manual, Installer None
Obtaining a new certificate
The currently selected ACME CA endpoint does not support issuing wildcard certificates.
```
参数说明：

certonly，插件，Certbot 有很多插件，不同的插件都可以申请证书，用户可以根据需要自行选择
-d 为那些主机申请证书，如果是通配符，输入 *.newyingyong.cn
–preferred-challenges dns，使用 DNS 方式校验域名所有权
接下去就是命令行的输出：

```
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator manual, Installer None
Enter email address (used for urgent renewal and security notices) (Enter 'c' to
cancel): ywdblog@gmail.com

-------------------------------------------------------------------------------
Please read the Terms of Service at
https://letsencrypt.org/documents/LE-SA-v1.2-November-15-2017.pdf. You must
agree in order to register with the ACME server at
https://acme-v02.api.letsencrypt.org/directory
-------------------------------------------------------------------------------
(A)gree/(C)ancel: A

Plugins selected: Authenticator manual, Installer None
Obtaining a new certificate
Performing the following challenges:
dns-01 challenge for newyingyong.cn

-------------------------------------------------------------------------------
NOTE: The IP of this machine will be publicly logged as having requested this
certificate. If you're running certbot in manual mode on a machine that is not
your server, please ensure you're okay with that.

Are you OK with your IP being logged?
-------------------------------------------------------------------------------
(Y)es/(N)o: y
```

上述有两个交互式的提示：

是否同意 Let's Encrypt 协议要求

询问是否对域名和机器（IP）进行绑定

确认同意才能继续。

继续查看命令行的输出，非常关键：

```
-------------------------------------------------------------------------------
Please deploy a DNS TXT record under the name
_acme-challenge.newyingyong.cn with the following value:

2_8KBE_jXH8nYZ2unEViIbW52LhIqxkg6i9mcwsRvhQ

Before continuing, verify the record is deployed.
-------------------------------------------------------------------------------
Press Enter to Continue
Waiting for verification...
Cleaning up challenges
```

要求配置 DNS TXT 记录，从而校验域名所有权，也就是判断证书申请者是否有域名的所有权。

上面输出要求给 _acme-challenge.newyingyong.cn 配置一条 TXT 记录，在没有确认 TXT 记录生效之前不要回车执行。

我使用的是阿里云的域名服务器，登录控制台操作如下图：

![](/img/alidns.png)

然后输入下列命令确认 TXT 记录是否生效：

```
$ dig  -t txt  _acme-challenge.newyingyong.cn @8.8.8.8    

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;_acme-challenge.newyingyong.cn.        IN      TXT

;; ANSWER SECTION:
_acme-challenge.newyingyong.cn. 599 IN  TXT     "2_8KBE_jXH8nYZ2unEViIbW52LhIqxkg6i9mcwsRvhQ"
```

确认生效后，回车执行，输出如下：

```
IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/newyingyong.cn/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/newyingyong.cn/privkey.pem
   Your cert will expire on 2018-06-12. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot-auto
   again. To non-interactively renew *all* of your certificates, run
   "certbot-auto renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```
恭喜您，证书申请成功，证书和密钥保存在下列目录：


```
$ tree /etc/letsencrypt/archive/newyingyong.cn
.
├── cert1.pem
├── chain1.pem
├── fullchain1.pem
└── privkey1.pem
```
然后校验证书信息，输入如下命令：
```
openssl x509 -in  /etc/letsencrypt/archive/newyingyong.cn/cert1.pem -noout -text
```
关键输出如下：
```
Authority Information Access:
        OCSP - URI:http://ocsp.int-x3.letsencrypt.org
        CA Issuers - URI:http://cert.int-x3.letsencrypt.org/

X509v3 Subject Alternative Name:
    DNS:*.newyingyong.cn
```
完美，证书包含了 SAN 扩展，该扩展的值就是 *.newyingyong.cn。
