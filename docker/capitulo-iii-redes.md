# CAPITULO III - REDES

O driver bridge é a ponte do container e da nossa máquina principal;

O host responsavel por se conectar diretamente com nossa máquina sem acesso a internet;

E null é responsável por se conectar sem contato nenhum com o mundo externo, não expoe nada na internet;

docker network → fazer operações de rede com o docker

docker network inspect idDaRede   → inspecionar a rede

docker network create —driver nomedodriveqvcquer nomeqvcquer → criar a rede

docker network connect nomedasuarede iddocontainer → conectar a rede no container
