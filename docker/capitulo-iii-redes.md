# CAPITULO III - REDES

O driver **bridge** (padrão) cria uma rede virtual isolada e liga o container à máquina por uma ponte — o container ganha IP próprio e precisa publicar porta (`-p`) para ser alcançado de fora;

O **host** faz o container **compartilhar a pilha de rede da própria máquina**: sem isolamento e sem NAT, o que o container abre na 8080 já está na 8080 do host. Ele **tem** acesso à internet normalmente — só funciona em Linux;

O **none** (esse é o nome correto do driver) deixa o container sem nenhuma interface de rede além do loopback — sem contato com o mundo externo, não expõe nada na internet;

docker network → fazer operações de rede com o docker

docker network inspect idDaRede   → inspecionar a rede

docker network create --driver nomedodriveqvcquer nomeqvcquer → criar a rede

docker network connect nomedasuarede iddocontainer → conectar a rede no container
