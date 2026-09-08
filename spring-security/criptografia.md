# CRIPTOGRAFIA

# Criptografia — resumo conceitual

> Complementa o material de autenticação e autorização. Foco nos conceitos e em *qual ferramenta resolve qual problema* — sem código.
> 

---

## 1. As quatro propriedades que a criptografia entrega

Antes dos algoritmos, vale saber o que se quer proteger. Toda ferramenta criptográfica existe para garantir uma ou mais destas:

| Propriedade | Pergunta que responde |
| --- | --- |
| **Confidencialidade** | Ninguém além do destinatário consegue ler? |
| **Integridade** | O conteúdo chegou sem alteração? |
| **Autenticidade** | Veio mesmo de quem diz ter vindo? |
| **Não-repúdio** | O autor pode negar depois que foi ele? |

**Erro comum:** achar que "criptografado" significa todas as quatro. Não significa. Cada uma exige uma ferramenta diferente, e algumas combinações são incompatíveis.

---

## 2. As três famílias

Praticamente toda criptografia aplicada cai em uma destas três. Saber qual usar é 80% do assunto.

| Família | Chaves | Reversível? | Entrega |
| --- | --- | --- | --- |
| **Hash** | nenhuma | não | integridade |
| **Simétrica** | uma, compartilhada | sim | confidencialidade |
| **Assimétrica** | par (pública + privada) | sim | confidencialidade *ou* autenticidade |

### 2.1 Hash

Transforma qualquer entrada em uma saída de tamanho fixo, de forma **determinística** e **irreversível**. Não tem chave e não tem volta.

Propriedades que um hash criptográfico precisa ter:

- **Resistência à pré-imagem** — dado o hash, não dá pra achar a entrada
- **Resistência à colisão** — não dá pra achar duas entradas com o mesmo hash
- **Efeito avalanche** — mudar 1 bit da entrada muda ~50% da saída

**Usos:** verificar integridade de arquivo, deduplicação, indexação, blocos de blockchain.

**MD5 e SHA-1 estão quebrados** — colisões são geradas na prática. Use SHA-256 ou superior. E, para senha, nenhum dos dois: veja a seção 4.

### 2.2 Simétrica

Uma única chave criptografa e descriptografa. É rápida — ordens de magnitude mais que a assimétrica — e é o que efetivamente protege dados em volume.

**Padrão atual: AES** (128 ou 256 bits). ChaCha20 é a alternativa comum em dispositivos sem aceleração de hardware.

Dois conceitos que sempre aparecem junto:

- **IV / nonce** — valor aleatório por operação, para que a mesma mensagem criptografada duas vezes gere resultados diferentes. Não é secreto, mas **nunca pode repetir com a mesma chave**.
- **Modo de operação** — como o algoritmo trata mensagens maiores que um bloco.

**Sobre modos:** `ECB` não deve ser usado nunca (blocos idênticos geram saídas idênticas, o padrão do dado vaza visualmente). O padrão moderno é **AES-GCM**, que é *AEAD*: criptografa **e** autentica na mesma operação, detectando adulteração. Sem AEAD, você precisa adicionar integridade separadamente — e é fácil errar.

**O problema central:** como as duas partes combinam a chave sem que um terceiro a intercepte? É exatamente isso que a criptografia assimétrica resolve.

### 2.3 Assimétrica

Duas chaves matematicamente ligadas. O que uma faz, só a outra desfaz.

- **Chave privada** — secreta, nunca sai do dono
- **Chave pública** — distribuída livremente

E aqui está o ponto que confunde: **existem dois usos, e eles são invertidos entre si.**

| Objetivo | Quem usa qual chave |
| --- | --- |
| **Confidencialidade** (só o dono lê) | Criptografa com a **pública** → só a **privada** abre |
| **Autenticidade** (provar autoria) | Assina com a **privada** → qualquer um confere com a **pública** |

Padrões: **RSA** (mais antigo, chaves grandes) e **ECC / curvas elípticas** (mesma segurança com chaves muito menores — preferível hoje).

**Limitação:** é lenta e só criptografa mensagens pequenas. Ninguém criptografa um arquivo de 2 GB com RSA.

---

## 3. Cifra híbrida — como as coisas realmente funcionam

Como a assimétrica é segura para distribuir chave mas lenta, e a simétrica é rápida mas precisa de uma chave já combinada, a solução é usar as duas:

1. As partes usam **assimétrica** para combinar com segurança uma chave simétrica temporária (chave de sessão)
2. Todo o resto do tráfego usa **simétrica**, com essa chave

É assim que funciona o TLS, o HTTPS, o PGP e praticamente tudo. A assimétrica aparece só no aperto de mão inicial; o volume de dados é sempre simétrico.

---

## 4. Hash vs KDF — a distinção que importa para senha

Hash comum é rápido **de propósito** (bom para integridade). Senha exige o oposto.

**KDF** (Key Derivation Function) é uma função desenhada para ser deliberadamente **cara**: bcrypt, scrypt, PBKDF2, **Argon2id** (recomendação atual).

|  | Hash comum (SHA-256) | KDF (Argon2, bcrypt) |
| --- | --- | --- |
| Velocidade | máxima | deliberadamente lenta |
| Custo ajustável | não | sim (tempo, memória, paralelismo) |
| Salt embutido | não | sim |
| Uso correto | integridade de dados | senhas e derivação de chave |

Argon2 e scrypt também são **memory-hard**: consomem muita RAM de propósito, o que anula a vantagem de GPUs e ASICs — que têm muitos núcleos, mas pouca memória por núcleo.

---

## 5. MAC, HMAC e assinatura digital

Três formas de garantir integridade + autenticidade. A diferença entre elas é sutil e cai em entrevista.

|  | Chave | Quem pode verificar | Não-repúdio |
| --- | --- | --- | --- |
| **Hash puro** | nenhuma | qualquer um | não (qualquer um recalcula) |
| **HMAC** | simétrica compartilhada | só quem tem a chave | **não** |
| **Assinatura digital** | par assimétrico | qualquer um (chave pública) | **sim** |

O ponto crítico: **HMAC não dá não-repúdio.** Como as duas partes têm a mesma chave, qualquer uma delas poderia ter gerado aquele MAC — nenhuma consegue provar que foi a outra. Já numa assinatura digital, só o dono da chave privada poderia tê-la produzido, então ele não pode negar depois.

> Essa é exatamente a razão de JWT em arquitetura distribuída usar assinatura assimétrica (RS256/ES256) em vez de HMAC (HS256): com HMAC, todo serviço que valida também poderia forjar.
> 

---

## 6. Certificados e PKI

Chave pública sozinha não prova nada. Se alguém te entrega uma chave dizendo "sou o banco", como saber que é mesmo?

**Certificado digital** = uma chave pública + informações de identidade, tudo **assinado por uma autoridade certificadora (CA)** em quem você já confia.

A confiança funciona em **cadeia**:

```
CA raiz (já instalada no seu SO/navegador)
   └── assina → CA intermediária
          └── assina → certificado do site
```

Você não confia no site diretamente. Você confia na CA raiz, que endossa a intermediária, que endossa o site. Quebrar qualquer elo invalida a cadeia.

**O que um certificado prova:** que aquela chave pública pertence àquele domínio, segundo uma CA.
**O que ele não prova:** que o site é honesto, seguro ou idôneo. Um site de phishing pode ter certificado válido — e normalmente tem.

Termos que aparecem junto:

- **Self-signed** — certificado que assina a si mesmo. Válido tecnicamente, sem cadeia de confiança. Serve para ambiente interno e desenvolvimento.
- **Revogação** — cancelar um certificado antes do vencimento (CRL, OCSP). Mesmo problema conceitual do JWT: revogar algo já emitido é sempre a parte difícil.
- **Rotação** — trocar chaves periodicamente para limitar o dano de um vazamento.

---

## 7. TLS em alto nível

O que acontece quando você abre um `https://`:

1. **Handshake** — cliente e servidor negociam algoritmos, o servidor apresenta seu certificado
2. **Verificação** — o cliente valida a cadeia do certificado até uma CA raiz confiável
3. **Troca de chave** — combinam uma chave simétrica de sessão (tipicamente via Diffie-Hellman)
4. **Tráfego** — tudo dali em diante é criptografia simétrica

**Forward secrecy:** desenhos modernos geram uma chave de sessão efêmera, descartada ao fim. Se a chave privada do servidor vazar amanhã, o tráfego gravado hoje continua ilegível — porque aquela chave de sessão não existe mais e não pode ser derivada.

**mTLS:** no TLS comum só o servidor apresenta certificado. No mútuo, o cliente também — é autenticação de máquina na camada de rede, base de arquiteturas de confiança zero.

---

## 8. Em trânsito vs em repouso

Dois momentos, duas ferramentas:

- **Em trânsito** — TLS protege enquanto o dado viaja. Não protege depois que chega.
- **Em repouso** — criptografia de disco, de banco, ou por campo. Protege o dado parado.

Um detalhe frequentemente ignorado: criptografia de disco protege contra alguém **levar o disco embora**. Não protege contra um invasor com acesso ao sistema em execução — para ele, o disco já está montado e descriptografado.

Para dados sensíveis específicos (CPF, cartão), criptografia **por campo** na aplicação é mais forte, porque o dado permanece cifrado mesmo dentro de um banco comprometido.

---

## 9. Aleatoriedade

Chaves, IVs, salts e tokens de sessão dependem de imprevisibilidade. Geradores comuns de números aleatórios (os de uso geral em qualquer linguagem) são **determinísticos e previsíveis** — servem para simulação, jamais para segurança.

Use sempre o gerador **criptograficamente seguro** da plataforma (CSPRNG). Aleatoriedade fraca já derrubou sistemas inteiros com criptografia perfeita no resto.

---

## 10. Regras práticas

- **Nunca implemente algoritmo criptográfico do zero.** Use bibliotecas maduras e auditadas. A vulnerabilidade quase nunca está na matemática — está na implementação (canal lateral, IV reutilizado, comparação não-constante).
- **Não invente protocolo.** Combinar primitivas corretas do jeito errado é a fonte mais comum de falha.
- **Segurança por obscuridade não é segurança.** O algoritmo deve poder ser público; só a chave é secreta (princípio de Kerckhoffs).
- **Criptografar não é hashear.** Se existe forma de recuperar o original, não serve para senha.
- **Gerenciamento de chave é o problema difícil.** Onde a chave fica, quem acessa, com que frequência rotaciona — isso quebra mais sistemas que qualquer algoritmo fraco.
- **Prefira AEAD** (AES-GCM, ChaCha20-Poly1305) a montar criptografia e integridade separadamente.

---

## 11. Mapa rápido: qual ferramenta para qual problema

| Preciso... | Uso |
| --- | --- |
| Guardar senha | KDF (Argon2id, bcrypt) |
| Verificar se um arquivo mudou | Hash (SHA-256) |
| Proteger dado em volume | Simétrica (AES-GCM) |
| Combinar chave com um desconhecido | Assimétrica / Diffie-Hellman |
| Provar autoria de forma irrefutável | Assinatura digital (RSA, ECDSA) |
| Garantir integridade entre duas partes que já compartilham segredo | HMAC |
| Proteger tráfego de rede | TLS |
| Autenticar máquina contra máquina | mTLS |
| Provar que uma chave pública é de quem diz ser | Certificado / PKI |

---

## Glossário

**AEAD** — modo que criptografa e autentica numa só operação (AES-GCM).
**CA** — autoridade certificadora; assina certificados de terceiros.
**Chave de sessão** — chave simétrica temporária, negociada por handshake.
**CSPRNG** — gerador de aleatoriedade seguro para uso criptográfico.
**Diffie-Hellman** — método de combinar uma chave secreta por canal público.
**ECC** — criptografia de curvas elípticas; mesma segurança com chaves menores.
**Forward secrecy** — vazamento futuro da chave privada não expõe tráfego passado.
**HMAC** — código de autenticação baseado em hash e chave compartilhada.
**IV / nonce** — valor único por operação; público, mas nunca repetido.
**KDF** — função de derivação de chave, deliberadamente cara.
**Memory-hard** — algoritmo que exige muita RAM, anulando vantagem de GPU.
**PKI** — infraestrutura de chaves públicas; o sistema de CAs e certificados.
**Salt** — valor aleatório único por senha, evita hashes iguais.
**TLS** — protocolo que protege comunicação em trânsito.
