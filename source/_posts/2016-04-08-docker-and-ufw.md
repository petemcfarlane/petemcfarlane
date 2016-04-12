---
title: Docker and Uncomplicated Firewall (UFW)
tags: [devops, docker, security]
categories: [docker]
---

I ran into an issue yesterday where even though I am using the [Uncomplicated Firewall (UFW)](https://help.ubuntu.com/community/UFW) with restricted access, I could still connect to some of my internal docker containers from outside my server.

This is because the docker daemon modifies iptables, allowing external connections to your containers if you're not careful!

I have made changes to the relevant `docker-compose.yml` files, instead of revealing ports on any network I now limit access to the localhost. So instead of 

```
app:
  ports:
   - "8080:80"
  ...
```

My ports config now looks like this

```
app:
  ports:
   - "127.0.0.1:8080:80"
  ...
```

This means that my container port `80` will be available on my local network, `127.0.0.1` port `8080`.

Remember to restart your docker containers after making this change.

I am then using Nginx as a proxy to manage port forwarding.

More information here:

 - [https://docs.docker.com/compose/compose-file/#ports](https://docs.docker.com/compose/compose-file/#ports)
 - [http://blog.viktorpetersson.com/post/101707677489/the-dangers-of-ufw-docker](http://blog.viktorpetersson.com/post/101707677489/the-dangers-of-ufw-docker)
