---
layout: post
title: 获取Let's Encrypt免费通配符证书实现Https
tags:
  - 技术
  - https
abbrlink: 40399
date: 2018-06-12 15:19:50
---

# 获取Let's Encrypt免费通配符证书实现Https

3月14日，Let's Encrypt的执行董事Josh Aas对外宣布，他们的通配符证书正式上线，用户可以基于此特性轻松部署/开启所有子域名的HTTPS功能。

Let's Encrypt 是国外一个公共的免费SSL项目，由 Linux 基金会托管，它的来头不小，由 Mozilla、思科、Akamai、IdenTrust 和 EFF 等组织发起，目的就是向网站自动签发和管理免费证书，以便加速互联网由 HTTP 过渡到 HTTPS，目前 Facebook 等大公司开始加入赞助行列。

Let's Encrypt 已经得了 IdenTrust 的交叉签名，这意味着其证书现在已经可以被 Mozilla、Google、Microsoft 和 Apple 等主流的浏览器所信任，用户只需要在 Web 服务器证书链中配置交叉签名，浏览器客户端会自动处理好其它的一切，Let's Encrypt 安装简单，使用非常方便。

## Linux下获取证书生成工具certbot

```
wget https://dl.eff.org/certbot-auto
chmod a+x certbot-auto
```

## 获取证书
```
shell ./certbot-auto certonly -d *.你的域名 --manual --preferred-challenges dns --server https://acme-v02.api.letsencrypt.org/directory
```

上述有三个交互式的提示：

是否同意 Let's Encrypt 协议要求
询问是否对域名和机器（IP）进行绑定
输入邮箱，给你发送一封验证邮件
确认同意才能继续。

继续查看命令行的输出，非常关键：

```
-------------------------------------------------------------------------------
Please deploy a DNS TXT record under the name
_acme-challenge.xxx.cn with the following value:

2_8KBE_jXH8nYZ2unEViIbW52LhIqxkg6i9mcwsRvhQ

Before continuing, verify the record is deployed.
-------------------------------------------------------------------------------
Press Enter to Continue
Waiting for verification...
Cleaning up challenges
```

要求给 _acme-challenge.xxx.cn 配置一条 TXT 记录，在没有确认 TXT 记录生效之前不要回车执行。

然后输入下列命令确认 TXT 记录是否生效：

```
$ dig  -t txt  _acme-challenge.xxx.cn @8.8.8.8    

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;_acme-challenge.xxx.cn.        IN      TXT

;; ANSWER SECTION:
_acme-challenge.xxx.cn. 599 IN  TXT     "2_8KBE_jXH8nYZ2unEViIbW52LhIqxkg6i9mcwsRvhQ"
```

确认生效后，回车执行

恭喜您，证书申请成功，证书和密钥保存在下列目录：

```
$ tree /etc/letsencrypt/archive/xxx.cn
.
├── cert1.pem
├── chain1.pem
├── fullchain1.pem
└── privkey1.pem
```

## 证书更新

证书有效期为三个月，到期之前需要更新证书，更新流程就是重新执行一遍上面的操作，新证书会在你申请证书的日期上加三个月。
