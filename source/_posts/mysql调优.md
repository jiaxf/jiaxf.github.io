---
layout: post
title: mysql调优
categories: 技术
tags:
  - mysql
abbrlink: 24130
---
# MySQL 调优

## mysql中的两个关键参数

(1)interactive_timeout:

参数含义：服务器关闭交互式连接前等待活动的秒数。交互式客户端定义为在mysql_real_connect()中使用CLIENT_INTERACTIVE选项的客户端。
参数默认值：28800秒（8小时）

(2)wait_timeout:

参数含义：服务器关闭非交互连接之前等待活动的秒数。
在线程启动时，根据全局wait_timeout值或全局interactive_timeout值初始化会话wait_timeout值，取决于客户端类型(由mysql_real_connect()的连接选项CLIENT_INTERACTIVE定义)。
参数默认值：28800秒（8小时）

wait_timeout过大有弊端，其体现就是MySQL里大量的SLEEP进程无法及时释放，拖累系统性能，不过也不能把这个指设置的过小，否则你可 能会遭遇到“MySQL has gone away”之类的问题，通常来说，我觉得把wait_timeout设置为10是个不错的选择，但某些情况下可能也会出问题，比如说有一个CRON脚本， 其中两次SQL查询的间隔时间大于10秒的话，那么这个设置就有问题了（当然，这也不是不能解决的问题，你可以在程序里时不时mysql_ping一下， 以便服务器知道你还活着，重新计算wait_timeout时间）

<!-- more -->

```mysql> set global wait_timeout=10;```

```
####  mysqladmin -uroot -ppassword variables|grep _cache ####
[mysqld]
#
# * Basic Settings
#
user            = mysql
socket          = /var/run/mysqld/mysqld.sock
port            = 3306
basedir         = /usr
datadir         = /var/lib/mysql
pid-file        = /var/run/mysqld/mysqld.pid   
tmpdir          = /tmp
lc-messages-dir = /usr/share/mysql      
#binlog的名字最好不要为默认，这样便于数据库的移植
#造成睡眠连接过多的原因？
#1.使用了太多持久连接（个人觉得，在高并发系统中，不适合使用持久连接）
#2.程序中，没有及时关闭mysql连接
#3.数据库查询不够优化，过度耗时
wait_timeout=300
interactive_timeout=300

#MySQL允许最大连接数
max_connections = 5000
#可以允许多少个错误连接
max_connect_errors = 6000

#忽略大小写
lower_case_table_names = 1


#避免Mysql的外部锁定，减少出错几率增加稳定性
#当外部锁定（external-locking）起作用时，每个进程若要访问数据表，则必须等待之前的进程完成操作并解除锁定。
#由于服务器访问数据表时经常需要等待解锁，因此在单服务器环境下external locking会让MySQL性能下降。
#所以在很多Linux发行版的源中，MySQL配置文件中默认使用了skip-external-locking来避免external locking。
#当使用了skip-external-locking后，为了使用MyISAMChk检查数据库或者修复、优化表，你必须保证在此过程中MySQL服务器没有使用需要操作的表。
#如果没有停止服务器，也至少需要先运行
#mysqladmin flush-tables
#详见http://www.bootf.com/594.html
skip-external-locking
#禁止mysql对外部链接进行DNS解析，使用这一选项可以消除Mysql进行DNS解析的时间,但需要注意，
#如果开启该选项，则所有远程主机连接授权都要使用IP地址的方式没,否则Mysql将无法正常处理连接请求!
skip-name-resolve
#指定MySQL可能的连接数量。当MySQL主线程在很短的时间内接收到非常多的连接请求，该参数生效，主线程花费很短的时间检查连接并且启动一个新线程。
#back_log 参数的值指出在MySQL暂时停止响应新请求之前的短时间内多少个请求可以被存在堆栈中。
#如果系统在一个短时间内有很多连接，则需要增大该参数的值，该参数值指定到来的TCP/IP连接的侦听队列的大小。
#不同的操作系统在这个队列大小上有它自己的限制。
#试图设定back_log高于你的操作系统的限制将是无效的。默认值为50。对于Linux系统推荐设置为小于512的整数
#在linux下这个参数的值不能大于系统参数tcp_max_syn_backlog的值。
#通过以下命令可以查看tcp_max_syn_backlog的当前值 cat /proc/sys/net/ipv4/tcp_max_syn_backlog。
#我将该值设为300，作为测试
#mysql> show variables like 'back_log';
back_log=300

wait_timeout=181440
#
# Instead of skip-networking the default is now to listen only on
# localhost which is more compatible and is not less secure.
#bind-address           = 129.0.0.124
#
# * Fine Tuning
#
#索引块是缓冲的并且被所有的线程共享。key_buffer_size是用于索引块的缓冲区大小，
#增加它可得到更好处理的索引(对所有读和多重写)，到你能负担得起那样多。如果你使它太大，
#系统将开始换页并且真的变慢了。
#http://dev.mysql.com/doc/refman/5.5/en/server-system-variables.html
#You can increase the value to get better index handling for all reads and multiple writes;
#on a system whose primary function is to run MySQL using the MyISAM storage engine,
#25% of the machine's total memory is an acceptable value for this variable.
#mysql> show variables like 'key_buffer%'
key_buffer_size         = 1G
max_allowed_packet      = 128M

#The stack size for each thread. Many of the limits detected by the crash-me test are dependent on this value.
#The default of 192KB (256KB for 64-bit systems) is large enough for normal operation.
#If the thread stack size is too small, it limits the complexity of the SQL statements that the server can handle,
#the recursion depth of stored procedures, and other memory-consuming actions.
#http://dev.mysql.com/doc/refman/5.5/en/server-system-variables.html
thread_stack            = 256K

#服务器线程缓存thread_cache_size没有进行设置，或者设置过小,这个值表示可以重新利用保存在缓存中线程的数量,
#当断开连接时如果缓存中还有空间,那么客户端的线程将被放到缓存中,如果线程重新被请求，那么请求将从缓存中读取,
#如果缓存中是空的或者是新的请求，那么这个线程将被重新创建,如果有很多新的线程，增加这个值可以改善系统性能.
#通过比较 Connections 和 Threads_created 状态的变量，可以看到这个变量的作用。(–>表示要调整的值)根据物理内存设置规则如下：
#1G  —> 8
#2G  —> 16
#3G  —> 32
#>3G  —> 64
thread_cache_size       = 64


#为了更快的open表，这个参数很重要；比如200个并发connection，table_open_cache=200×N（一个查询中参与join的最大表的数量，也可能是分区表），如果是myisam表的话，table_open_cache=200×(N×2),还要考虑突发的临时表的文件描述符；在os可以支持打开文件数时，如果table_open_cache设置的比较高，mysql用光所有的文件描述符，就会拒绝连
#，查询出错.table_open_cache设置多大合适呢？处理从上面的理论推理计算外，还可以根据状态变量来监控“Opened_tables”，这个状态变量表示，从server服务启动为止，open表的数量，可以根据这个状态变量来比较精准的设置table_oprn_cache
#暂时设定为1024，需要有大规模考试测试做依据
#show global status like '%open%table%'
table_open_cache = 1024


# Sort_Buffer_Size 是一个connection级参数，在每个connection（session）第一次需要使用这个buffer的时候，一次性分配设置的内存。
#Sort_Buffer_Size 并不是越大越好，由于是connection级的参数，过大的设置+高并发可能会耗尽系统内存资源。例如：500个连接将会消耗 500*sort_buffer_size(8M)=4G内存
#Sort_Buffer_Size 超过2KB的时候，就会使用mmap() 而不是 malloc() 来进行内存分配，导致效率降低。
#技术导读 http://blog.webshuo.com/2011/02/16/mysql-sort_buffer_size/
#dev-doc: http://dev.mysql.com/doc/refman/5.5/en/server-parameters.html
#explain select*from table where order limit；出现filesort
#属重点优化参数
sort_buffer_size = 16M
#用于表间关联缓存的大小
join_buffer_size = 16M

# MySql读入缓冲区大小。对表进行顺序扫描的请求将分配一个读入缓冲区，MySql会为它分配一段内存缓冲区。read_buffer_size变量控制这一缓冲区的大小。如果对表的顺序扫>描请求非常频繁，并且你认为频繁扫描进行得太慢，可以通过增加该变量值以及内存缓冲区大小提高其性能。
read_buffer_size = 32M

# MySql的随机读（查询操作）缓冲区大小。当按任意顺序读取行时(例如，按照排序顺序)，将分配一个随机读缓存区。进行排序查询时，MySql会首先扫描一遍该缓冲，以避免磁>盘搜索，提高查询速度，如果需要排序大量数据，可适当调高该值。但MySql会为每个客户连接发放该缓冲空间，所以应尽量适当设置该值，以避免内存开销过>大。
read_rnd_buffer_size = 32M

# MyISAM表发生变化时重新排序所需的缓冲
myisam_sort_buffer_size = 128M

# This replaces the startup script and checks MyISAM tables if needed
# the first time they are touch
myisam-recover         = BACKUP
#max_connections        = 100
#table_cache            = 64
#thread_concurrency     = 10
#
# * Query Cache Configuration
#允许cache 的单条 Query 结果集的最大容量，默认是1MB，超过此参数设置的 Query 结果集将不会被 Cache
query_cache_limit       = 4M

#设置Query Cache所使用的内存大小，默认值为0，大小必须是1024的整数倍，如果不是整数倍，MySQL 会自动调整降低最小量以达到1024的倍数。
#当我们打开了 Query Cache功能，MySQL在接受到一条select语句的请求后，如果该语句满足Query Cache的要求
#(未显式说明不允许使用Query Cache，或者已经显式申明需要使用Query Cache)，
#MySQL会直接根据预先设定好的HASH算法将接受到的select语句以字符串方式进行hash，然后到Query Cache中直接查找是否已经缓存。
#也就是说，如果已经在缓存中，该select请求就会直接将数据返回，
#从而省略了后面所有的步骤(如SQL语句的解析，优化器优化以及向存储引擎请求数据等)，极大的提高性能。
#当然，Query Cache也有一个致命的缺陷，那就是当某个表的数据有任何任何变化，都会导致所有引用了该表的select语句在Query Cache中的缓存数据失效。
#所以，当我们的数据变化非常频繁的情况下，使用Query Cache可能会得不偿失。
#以往的经验来看，如果不是用来缓存基本不变的数据的MySQL数据库，query_cache_size一般256MB是一个比较合适的大小。
#当然，这可以通过计算Query Cache的命中率(Qcache_hits/(Qcache_hits+Qcache_inserts)*100))来进行调整。
#这里我设置为512Ｍ需要具体测试结果来查看最后Querycache的命中率
#http://www.csdn.net/article/2011-10-28/306555
query_cache_size        = 512M

#
# * Logging and Replication
#
# Both location gets rotated by the cronjob.
# Be aware that this log type is a performance killer.
# As of 5.1 you can enable the log at runtime!
#general_log_file        = /var/log/mysql/mysql.log
#general_log             = 1
#
# Error logging goes to syslog due to /etc/mysql/conf.d/mysqld_safe_syslog.cnf.
# Here you can see queries with especially long duration
#log_slow_queries        = /usr/local/mysql5/log/mysql-slow.log
#默认设置为2表示执行时间超过2秒的都算慢查询(itest中是否有过多的慢查询，开启log文件后可看到具体的详细信息
long_query_time = 4
log_error               = /var/log/mysql/error.log  
#log-queries-not-using-indexes
#
# The following can be used as easy to replay backup logs or for replication.
# note: if you are setting up a replication slave, see README.Debian about
#       other settings you may need to change.

#For mysql Master and Slave
server-id              = 56
#binlog的名字最好不要为默认，这样便于数据库的移植
#log-bin                = /usr/local/mysql5/log/mysql-bin.log
#relay_log              = /usr/local/mysql5/log/relay-bin
#skip_slave_start
#read_only
expire_logs_days       = 10
max_binlog_size        = 100M
#############I##nnoDB部分##################
#完整的InnoDB优化方案:http://www.mysqlperformanceblog.com/2007/11/01/innodb-performance-optimization-basics/
#http://swachian.iteye.com/blog/193788
#抱怨Innodb比MyISAM慢100倍？那么你大概是忘了调整这个值。
#默认值1的意思是每一次事务提交或事务外的指令都需要把日志写入（flush）硬盘，这是很费时的。
#特别是使用电池供电缓存（Battery backed up cache）时。设成2对于很多运用，特别是从MyISAM表转过来的是可以的，
#它的意思是不写入硬盘而是写入系统缓存。日志仍然会每秒flush到硬 盘，所以你一般不会丢失超过1-2秒的更新。
#设成0会更快一点，但安全方面比较差，即使MySQL挂了也可能会丢失事务的数据。而值2只会在整个操作系统挂了时才可能丢数据。
innodb_flush_log_at_trx_commit=0



# Set buffer pool size to 50-80% of your computer's memory
#针对服务器学校服务器比较烂的原因，我选择4Ｇ内存作为基准
#高过1Ｇ启动不了
innodb_buffer_pool_size=8G


#http://www.cnblogs.com/zuoxingyu/archive/2012/10/25/2738864.html
innodb_log_file_size= 64M
innodb_log_buffer_size = 16M

# 附加的内存池被InnoDB用来保存 metadata 信息
# 如果InnoDB为此目的需要更多的内存,它会开始从OS这里申请内存.
# 由于这个操作在大多数现代操作系统上已经足够快, 你一般不需要修改此值.
# SHOW INNODB STATUS 命令会显示当先使用的数量.
# 根据表的多少来确定大小，一般16M己能适用于几百个表
#innodb_additional_mem_pool_size=16M

# 在InnoDb核心内的允许线程数量.
# 最优值依赖于应用程序,硬件以及操作系统的调度方式.
# 过高的值可能导致线程的互斥颠簸.
#innodb_thread_concurrency=8


#Avoid double buffering and reduce swap pressure, in most cases this setting improves performance.
#Though be careful if you do not have battery backed up RAID cache as when write IO may suffer.
#在Linux上使用Direct IO。可以显著提高速度，特别是在RAID系统上。避免额外的数据复制和double buffering（mysql buffering 和OS buffering）。
innodb_flush_method=O_DIRECT

# Buffer_Pool中Dirty_Page所占的数量，直接影响InnoDB的关闭时间。参数innodb_max_dirty_pages_pct可以直接控制了Dirty_Page在Buffer_Pool中所占的比率，而且幸运的是innodb_max_dirty_pages_pct是可以动态改变的。所以，在关闭InnoDB之前先将innodb_max_dirty_pages_pct调小，强制数据块Flush一段时间，则能够大大缩>短MySQL关闭的时间>。
innodb_max_dirty_pages_pct = 90

```

```
back_log = 600   
#在MYSQL暂时停止响应新请求之前，短时间内的多少个请求可以被存在堆栈中。如果系统在短时间内有很多连接，则需要增大该参数的值，该参数值指定到来的TCP/IP连接的监听队列的大小。默认值50。

max_connections = 3000   
#MySQL允许最大的进程连接数，如果经常出现Too Many Connections的错误提示，则需要增大此值。

max_connect_errors = 6000   
#设置每个主机的连接请求异常中断的最大次数，当超过该次数，MYSQL服务器将禁止host的连接请求，直到mysql服务器重启或通过flush hosts命令清空此host的相关信息。

table_cache = 614  
#指示表调整缓冲区大小。# table_cache 参数设置表高速缓存的数目。每个连接进来，都会至少打开一个表缓存。#因此， table_cache 的大小应与 max_connections 的设置有关。例如，对于 200 个#并行运行的连接，应该让表的缓存至少有 200 × N ，这里 N 是应用可以执行的查询#的一个联接中表的最大数量。此外，还需要为临时表和文件保留一些额外的文件描述符。
# 当 Mysql 访问一个表时，如果该表在缓存中已经被打开，则可以直接访问缓存；如果#还没有被缓存，但是在 Mysql 表缓冲区中还有空间，那么这个表就被打开并放入表缓#冲区；如果表缓存满了，则会按照一定的规则将当前未用的表释放，或者临时扩大表缓存来存放，使用表缓存的好处是可以更快速地访问表中的内容。执行 flush tables 会#清空缓存的内容。一般来说，可以通过查看数据库运行峰值时间的状态值 Open_tables #和 Opened_tables ，判断是否需要增加 table_cache 的值（其中 open_tables 是当#前打开的表的数量， Opened_tables 则是已经打开的表的数量）。即如果open_tables接近table_cache的时候，并且Opened_tables这个值在逐步增加，那就要考虑增加这个#值的大小了。还有就是Table_locks_waited比较高的时候，也需要增加table_cache。


external-locking = FALSE  
#使用–skip-external-locking MySQL选项以避免外部锁定。该选项默认开启

max_allowed_packet = 32M  
#设置在网络传输中一次消息传输量的最大值。系统默认值 为1MB，最大值是1GB，必须设置1024的倍数。

sort_buffer_size = 2M  
# Sort_Buffer_Size 是一个connection级参数，在每个connection（session）第一次需要使用这个buffer的时候，一次性分配设置的内存。
#Sort_Buffer_Size 并不是越大越好，由于是connection级的参数，过大的设置+高并发可能会耗尽系统内存资源。例如：500个连接将会消耗 500*sort_buffer_size(8M)=4G内存
#Sort_Buffer_Size 超过2KB的时候，就会使用mmap() 而不是 malloc() 来进行内存分配，导致效率降低。
#技术导读 http://blog.webshuo.com/2011/02/16/mysql-sort_buffer_size/
#dev-doc: http://dev.mysql.com/doc/refman/5.5/en/server-parameters.html
#explain select*from table where order limit；出现filesort
#属重点优化参数

join_buffer_size = 2M   
#用于表间关联缓存的大小，和sort_buffer_size一样，该参数对应的分配内存也是每个连接独享。

thread_cache_size = 300   
# 服务器线程缓存这个值表示可以重新利用保存在缓存中线程的数量,当断开连接时如果缓存中还有空间,那么客户端的线程将被放到缓存中,如果线程重新被请求，那么请求将从缓存中读取,如果缓存中是空的或者是新的请求，那么这个线程将被重新创建,如果有很多新的线程，增加这个值可以改善系统性能.通过比较 Connections 和 Threads_created 状态的变量，可以看到这个变量的作用。设置规则如下：1GB 内存配置为8，2GB配置为16，3GB配置为32，4GB或更高内存，可配置更大。

thread_concurrency = 8   
# 设置thread_concurrency的值的正确与否, 对mysql的性能影响很大, 在多个cpu(或多核)的情况下，错误设置了thread_concurrency的值, 会导致mysql不能充分利用多cpu(或多核), 出现同一时刻只能一个cpu(或核)在工作的情况。thread_concurrency应设为CPU核数的2倍. 比如有一个双核的CPU, 那么thread_concurrency的应该为4; 2个双核的cpu, thread_concurrency的值应为8
#属重点优化参数

query_cache_size = 64M   
## 对于使用MySQL的用户，对于这个变量大家一定不会陌生。前几年的MyISAM引擎优化中，这个参数也是一个重要的优化参数。但随着发展，这个参数也爆露出来一些问题。机器的内存越来越大，人们也都习惯性的把以前有用的参数分配的值越来越大。这个参数加大后也引发了一系列问题。我们首先分析一下 query_cache_size的工作原理：一个SELECT查询在DB中工作后，DB会把该语句缓存下来，当同样的一个SQL再次来到DB里调用时，DB在该表没发生变化的情况下把结果从缓存中返回给Client。这里有一个关建点，就是DB在利用Query_cache工作时，要求该语句涉及的表在这段时间内没有发生变更。那如果该表在发生变更时，Query_cache里的数据又怎么处理呢？首先要把Query_cache和该表相关的语句全部置为失效，然后在写入更新。那么如果Query_cache非常大，该表的查询结构又比较多，查询语句失效也慢，一个更新或是Insert就会很慢，这样看到的就是Update或是Insert怎么这么慢了。所以在数据库写入量或是更新量也比较大的系统，该参数不适合分配过大。而且在高并发，写入量大的系统，建议把该功能禁掉。
#重点优化参数（主库 增删改-MyISAM）

query_cache_limit = 4M    
#指定单个查询能够使用的缓冲区大小，缺省为1M

query_cache_min_res_unit = 2k    
#默认是4KB，设置值大对大数据查询有好处，但如果你的查询都是小数据查询，就容易造成内存碎片和浪费
#查询缓存碎片率 = Qcache_free_blocks / Qcache_total_blocks * 100%
#如果查询缓存碎片率超过20%，可以用FLUSH QUERY CACHE整理缓存碎片，或者试试减小query_cache_min_res_unit，如果你的查询都是小数据量的话。
#查询缓存利用率 = (query_cache_size – Qcache_free_memory) / query_cache_size * 100%
#查询缓存利用率在25%以下的话说明query_cache_size设置的过大，可适当减小;查询缓存利用率在80%以上而且Qcache_lowmem_prunes > 50的话说明query_cache_size可能有点小，要不就是碎片太多。
#查询缓存命中率 = (Qcache_hits – Qcache_inserts) / Qcache_hits * 100%

default-storage-engine = MyISAM
#default_table_type = InnoDB

thread_stack = 192K  
#设置MYSQL每个线程的堆栈大小，默认值足够大，可满足普通操作。可设置范围为128K至4GB，默认为192KB。

transaction_isolation = READ-COMMITTED   
# 设定默认的事务隔离级别.可用的级别如下:
# READ-UNCOMMITTED, READ-COMMITTED, REPEATABLE-READ, SERIALIZABLE
# 1.READ UNCOMMITTED-读未提交2.READ COMMITTE-读已提交3.REPEATABLE READ -可重复读4.SERIALIZABLE -串行

tmp_table_size = 256M   
# tmp_table_size 的默认大小是 32M。如果一张临时表超出该大小，MySQL产生一个 The table tbl_name is full 形式的错误，如果你做很多高级 GROUP BY 查询，增加 tmp_table_size 值。如果超过该值，则会将临时表写入磁盘。
max_heap_table_size = 256M
long_query_time = 2
log_long_format
log-slow-queries=/data/3306/slow-log.log
#log-bin = /data/3306/mysql-bin
log-bin
binlog_cache_size = 4M
max_binlog_cache_size = 8M
max_binlog_size = 512M

expire_logs_days = 7
key_buffer_size = 2048M
#批定用于索引的缓冲区大小，增加它可以得到更好的索引处理性能，对于内存在4GB左右的服务器来说，该参数可设置为256MB或384MB。

read_buffer_size = 1M  
# MySql读入缓冲区大小。对表进行顺序扫描的请求将分配一个读入缓冲区，MySql会为它分配一段内存缓冲区。read_buffer_size变量控制这一缓冲区的大小。如果对表的顺序扫描请求非常频繁，并且你认为频繁扫描进行得太慢，可以通过增加该变量值以及内存缓冲区大小提高其性能。和sort_buffer_size一样，该参数对应的分配内存也是每个连接独享。

read_rnd_buffer_size = 16M   
# MySql的随机读（查询操作）缓冲区大小。当按任意顺序读取行时(例如，按照排序顺序)，将分配一个随机读缓存区。进行排序查询时，MySql会首先扫描一遍该缓冲，以避免磁盘搜索，提高查询速度，如果需要排序大量数据，可适当调高该值。但MySql会为每个客户连接发放该缓冲空间，所以应尽量适当设置该值，以避免内存开销过大。

bulk_insert_buffer_size = 64M   
#批量插入数据缓存大小，可以有效提高插入效率，默认为8M

myisam_sort_buffer_size = 128M   
# MyISAM表发生变化时重新排序所需的缓冲

myisam_max_sort_file_size = 10G   
# MySQL重建索引时所允许的最大临时文件的大小 (当 REPAIR, ALTER TABLE 或者 LOAD DATA INFILE).
# 如果文件大小比此值更大,索引会通过键值缓冲创建(更慢)

myisam_max_extra_sort_file_size = 10G
myisam_repair_threads = 1   
# 如果一个表拥有超过一个索引, MyISAM 可以通过并行排序使用超过一个线程去修复他们.
# 这对于拥有多个CPU以及大量内存情况的用户,是一个很好的选择.

myisam_recover   
#自动检查和修复没有适当关闭的 MyISAM 表
skip-name-resolve
lower_case_table_names = 1

server-id = 1

innodb_additional_mem_pool_size = 16M   
#这个参数用来设置 InnoDB 存储的数据目录信息和其它内部数据结构的内存池大小，类似于Oracle的library cache。这不是一个强制参数，可以被突破。

innodb_buffer_pool_size = 2048M   
# 这对Innodb表来说非常重要。Innodb相比MyISAM表对缓冲更为敏感。MyISAM可以在默认的 key_buffer_size 设置下运行的可以，然而Innodb在默认的 innodb_buffer_pool_size 设置下却跟蜗牛似的。由于Innodb把数据和索引都缓存起来，无需留给操作系统太多的内存，因此如果只需要用Innodb的话则可以设置它高达 70-80% 的可用内存。一些应用于 key_buffer 的规则有 — 如果你的数据量不大，并且不会暴增，那么无需把 innodb_buffer_pool_size 设置的太大了

innodb_data_file_path = ibdata1:1024M:autoextend   
#表空间文件 重要数据

innodb_file_io_threads = 4   
#文件IO的线程数，一般为 4，但是在 Windows 下，可以设置得较大。

innodb_thread_concurrency = 8   
#服务器有几个CPU就设置为几，建议用默认设置，一般为8.

innodb_flush_log_at_trx_commit = 2   
# 如果将此参数设置为1，将在每次提交事务后将日志写入磁盘。为提供性能，可以设置为0或2，但要承担在发生故障时丢失数据的风险。设置为0表示事务日志写入日志文件，而日志文件每秒刷新到磁盘一次。设置为2表示事务日志将在提交时写入日志，但日志文件每次刷新到磁盘一次。

innodb_log_buffer_size = 16M  
#此参数确定些日志文件所用的内存大小，以M为单位。缓冲区更大能提高性能，但意外的故障将会丢失数据.MySQL开发人员建议设置为1－8M之间

innodb_log_file_size = 128M   
#此参数确定数据日志文件的大小，以M为单位，更大的设置可以提高性能，但也会增加恢复故障数据库所需的时间

innodb_log_files_in_group = 3   
#为提高性能，MySQL可以以循环方式将日志文件写到多个文件。推荐设置为3M

innodb_max_dirty_pages_pct = 90   
#推荐阅读 http://www.taobaodba.com/html/221_innodb_max_dirty_pages_pct_checkpoint.html
# Buffer_Pool中Dirty_Page所占的数量，直接影响InnoDB的关闭时间。参数innodb_max_dirty_pages_pct 可以直接控制了Dirty_Page在Buffer_Pool中所占的比率，而且幸运的是innodb_max_dirty_pages_pct是可以动态改变的。所以，在关闭InnoDB之前先将innodb_max_dirty_pages_pct调小，强制数据块Flush一段时间，则能够大大缩短 MySQL关闭的时间。

innodb_lock_wait_timeout = 120   
# InnoDB 有其内置的死锁检测机制，能导致未完成的事务回滚。但是，如果结合InnoDB使用MyISAM的lock tables 语句或第三方事务引擎,则InnoDB无法识别死锁。为消除这种可能性，可以将innodb_lock_wait_timeout设置为一个整数值，指示 MySQL在允许其他事务修改那些最终受事务回滚的数据之前要等待多长时间(秒数)

innodb_file_per_table = 0   
#独享表空间（关闭）

[mysqldump]
quick
max_allowed_packet = 32M

[mysqld_safe]
log-error=/data/3306/mysql_oldboy.err
pid-file=/data/3306/mysqld.pid



#补充
#wait_timeout = 10   
#指定一个请求的最大连接时间，对于4GB左右的内存服务器来说，可以将其设置为5-10。
#skip_networking   
#开启该选可以彻底关闭MYSQL的TCP/IP连接方式，如果WEB服务器是以远程连接的方式访问MYSQL数据库服务器的，则不要开启该选项，否则将无法正常连接。

#log-queries-not-using-indexes
将没有使用索引的查询也记录下来

```
