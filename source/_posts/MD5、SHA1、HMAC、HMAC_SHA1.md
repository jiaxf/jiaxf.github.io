---
layout: post
title: MD5、SHA1、HMAC、HMAC_SHA1区别
tags:
  - 技术
  - 加密
  - 解密
  - Base64
  - md5
  - 算法
---

# MD5、SHA1、HMAC、HMAC_SHA1区别

## MD5

MD5 -- message-digest algorithm 5(信息-摘要算法)缩写，是一种不可逆的加密算法，对任何字符串都可以加密成一段唯一的固定长度的代码。可以是128位。
MD5码可以唯一地代码原信息的特征，通常用于密码的加密存储，数字签名，文件完整性验证等。

```
/**  
 * MD5加密  
 *   
 * @param data  
 * @return  
 * @throws Exception  
 */
public static byte[] encryptMD5(byte [] data) throws Exception {

  MessageDigest md5 = MessageDigest.getInstance(KEY_MD5);
  md5.update(data);

  return md5.digest();
}
```

## SHA1

SHA(Secure Hash Algorithm,安全散列算法)，较MD5更安全。
SHA1是由NISTNSA设计，对长度小于264的输入，产生长度为160bit的散列值，可穷举性(brute-force
  )更好。SHA-1是由美国标准技术局（NIST）颁布的国家标准，是一种应用最为广泛的Hash函数算法，也是
  目前最先进的加密技术，被政府部门和私营业主用来处理敏感信息。也常用于验证文件有没有被篡改。

  ```
  public static byte[] encryptSHA(byte[] data) throws Exception {

    MessageDigest sha = MessageDigest.getInstance(KEY_SHA);
    sha.update(data);

    return sha.digest();
  }
  ```

## HMAC_SHA1

HMAC是密钥相关的哈希运算消息认证码(Hash-based Message Authentication Code, 散列消息鉴别码),HMAC运算利用哈希算法，以一个密钥和一个消息为输入，生产一个消息摘要作为输出。消息鉴别码实现鉴别的原理是，
用公开函数和密钥产生一个固定长度的值作为认证标识，用这个标识鉴别消息的完整性。使用一个密钥生成一个
固定大小的小数据块，即MAC,并将其加入到消息中，然后传输。接收方利用与发送方共享的密钥进行鉴别认证等。

HMAC_SHA1需要一个密钥，而SHA1不需要。

```
/**  
 * 初始化HMAC密钥  
 *   
 * @return  
 * @throws Exception  
 */
public static String initMacKey() throws Exception {
  Keygenerator keyGenerator = KeyGenerator.getInstance(KEY_MAC);

  SecretKey secretKey = keyGenerator.geterateKey();
  return encryptBASE64(secretKey.getEncoded());
}

/**  
 * HMAC加密  
 *   
 * @param data  
 * @param key  
 * @return  
 * @throws Exception  
 */
public static byte[] encryptHMAC(byte[] data, String key) throws Exception {

  SecretKey secretKey = new SecretKeySpec(decryptBASE64(key), KEY_MAC);
  Mac mac = Mac.getInstance(secretKey.getAlgorithm());
  mac.init(secretKey);

  return mac.doFinal(data);
}
```

## CRC

CRC的全称为CyclicRedundancyCheck，中文名称为循环冗余校验。它是一类重要的线性分组码，编码和解码方法
简单，检错和纠错能力强，在通信领域广泛地用于实现差错控制。

## BASE64

按照RFC2045的定义，Base64被定义为：Base64内容传送编码被设计用来把任意序列的8位字节描述为一种
不易被人直接识别的形式。（The Base64 Content-Transfer-Encoding is designed to represent
 brbitrary sequences of octets in a form that need not be humamly readable.）

 ```
 /**  
 * BASE64解密  
 *   
 * @param key  
 * @return  
 * @throws Exception  
 */
 public static byte[] decryptBASE64(String key) throws Exception {
   return (new BASE64Decoder()).decodeBuffer(key);
 }

 /**  
 * BASE64加密  
 *   
 * @param key  
 * @return  
 * @throws Exception  
 */    
 public static String encryptBASE64(byte[] key) throws Exception {
   return (new BASE64Encoder()).encodeBuffer(key);
 }
 ```



##　hash算法的作用

- 1. 文件校验

MD5Hash算法的“数字指纹”，使它成为目前应用最广泛的一种文件完整性校验和（Checksum）算法，不少Unix
系统有提供计算md5checksum的命令。

- 2. 数字签名

Hash算法也是现代密码体系中的一个重要组成部分，由于非对称算法的运算速度较慢，所以在数字签名协议中，
单项散列函数扮演了一个重要的角色。对Hash值，又称”数字摘要”进行数字签名，在统计上可以任务与对文件
本身进行数字签名是等效的。

 - 3. 鉴权协议

*完整代码*

```
import java.security.MessageDigest;    

import javax.crypto.KeyGenerator;    
import javax.crypto.Mac;    
import javax.crypto.SecretKey;    

import sun.misc.BASE64Decoder;    
import sun.misc.BASE64Encoder;    

/**  
 * 基础加密组件  
 *   
 * @author jiaxf  
 * @version 1.0  
 * @since 1.0  
 */    
public abstract class Coder {    
    public static final String KEY_SHA = "SHA";    
    public static final String KEY_MD5 = "MD5";    

    /**  
     * MAC算法可选以下多种算法  
     *   
     * <pre>  
     * HmacMD5   
     * HmacSHA1   
     * HmacSHA256   
     * HmacSHA384   
     * HmacSHA512  
     * </pre>  
     */    
    public static final String KEY_MAC = "HmacMD5";    

    /**  
     * BASE64解密  
     *   
     * @param key  
     * @return  
     * @throws Exception  
     */    
    public static byte[] decryptBASE64(String key) throws Exception {    
        return (new BASE64Decoder()).decodeBuffer(key);    
    }    

    /**  
     * BASE64加密  
     *   
     * @param key  
     * @return  
     * @throws Exception  
     */    
    public static String encryptBASE64(byte[] key) throws Exception {    
        return (new BASE64Encoder()).encodeBuffer(key);    
    }    

    /**  
     * MD5加密  
     *   
     * @param data  
     * @return  
     * @throws Exception  
     */    
    public static byte[] encryptMD5(byte[] data) throws Exception {    

        MessageDigest md5 = MessageDigest.getInstance(KEY_MD5);    
        md5.update(data);    

        return md5.digest();    

    }    

    /**  
     * SHA加密  
     *   
     * @param data  
     * @return  
     * @throws Exception  
     */    
    public static byte[] encryptSHA(byte[] data) throws Exception {    

        MessageDigest sha = MessageDigest.getInstance(KEY_SHA);    
        sha.update(data);    

        return sha.digest();    

    }    

    /**  
     * 初始化HMAC密钥  
     *   
     * @return  
     * @throws Exception  
     */    
    public static String initMacKey() throws Exception {    
        KeyGenerator keyGenerator = KeyGenerator.getInstance(KEY_MAC);    

        SecretKey secretKey = keyGenerator.generateKey();    
        return encryptBASE64(secretKey.getEncoded());    
    }    

    /**  
     * HMAC加密  
     *   
     * @param data  
     * @param key  
     * @return  
     * @throws Exception  
     */    
    public static byte[] encryptHMAC(byte[] data, String key) throws Exception {    

        SecretKey secretKey = new SecretKeySpec(decryptBASE64(key), KEY_MAC);    
        Mac mac = Mac.getInstance(secretKey.getAlgorithm());    
        mac.init(secretKey);    

        return mac.doFinal(data);    

    }    
}
```

*测试类*

```
import  static org.junit.Assert.*;

import org.junit.Test;

/**  
 *   
 * @author jiaxf
 * @version 1.0  
 * @since 1.0  
 */    
public class CoderTest {    

    @Test    
    public void test() throws Exception {    
        String inputStr = "简单加密";    
        System.err.println("原文:/n" + inputStr);    

        byte[] inputData = inputStr.getBytes();    
        String code = Coder.encryptBASE64(inputData);    

        System.err.println("BASE64加密后:/n" + code);    

        byte[] output = Coder.decryptBASE64(code);    

        String outputStr = new String(output);    

        System.err.println("BASE64解密后:/n" + outputStr);    

        // 验证BASE64加密解密一致性    
        assertEquals(inputStr, outputStr);    

        // 验证MD5对于同一内容加密是否一致    
        assertArrayEquals(Coder.encryptMD5(inputData), Coder    
                .encryptMD5(inputData));    

        // 验证SHA对于同一内容加密是否一致    
        assertArrayEquals(Coder.encryptSHA(inputData), Coder    
                .encryptSHA(inputData));    

        String key = Coder.initMacKey();    
        System.err.println("Mac密钥:/n" + key);  

        // 验证HMAC对于同一内容，同一密钥加密是否一致    
        assertArrayEquals(Coder.encryptHMAC(inputData, key), Coder.encryptHMAC(    
                inputData, key));    

        BigInteger md5 = new BigInteger(Coder.encryptMD5(inputData));    
        System.err.println("MD5:/n" + md5.toString(16));    

        BigInteger sha = new BigInteger(Coder.encryptSHA(inputData));    
        System.err.println("SHA:/n" + sha.toString(32));    

        BigInteger mac = new BigInteger(Coder.encryptHMAC(inputData, inputStr));    
        System.err.println("HMAC:/n" + mac.toString(16));    
    }    
}    
```


## 参考

1. [加密算法中BASE64、MD5、SHA、HMAC等之间的区别](https://blog.csdn.net/lplj717/article/details/51828692)
