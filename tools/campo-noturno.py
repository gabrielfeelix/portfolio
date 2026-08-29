#!/usr/bin/env python3
"""Gera a cena da quebra: campo de noite em camadas, no registro de Journey.

Cada camada sai tambem em arquivo proprio e com alpha, porque o destino e
parallax multicamada — a cena unica aqui e so a prova de composicao.

As formas nao sao morro real. Journey nao desenha geologia: desenha duna, uma
curva dominante por forma, silhueta que se le num relance. Por isso os perfis
saem de poucos pontos de controle passados por Catmull-Rom, e nao de ruido —
ruido da montanha, controle da duna.
"""
import math, random
from PIL import Image, ImageDraw, ImageFilter

W, H = 2400, 1120
random.seed(7)

def catmull(pts, n):
    """Curva suave passando POR todos os pontos. p[i] = (x,y) em fracao."""
    p = [pts[0]] + list(pts) + [pts[-1], pts[-1]]
    saida = []
    for i in range(len(p) - 3):
        p0, p1, p2, p3 = p[i], p[i+1], p[i+2], p[i+3]
        for s in range(n):
            t = s / n; t2 = t*t; t3 = t2*t
            x = .5*((2*p1[0]) + (-p0[0]+p2[0])*t +
                    (2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2 +
                    (-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3)
            y = .5*((2*p1[1]) + (-p0[1]+p2[1])*t +
                    (2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2 +
                    (-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3)
            saida.append((x, y))
    saida.append(p[-1])
    return saida

def perfil(pts, passos=64):
    """Devolve altura y (px) por coluna x, interpolada da curva."""
    c = catmull(pts, passos)
    alt = [None]*W
    for x, y in c:
        cx = min(W-1, max(0, int(round(x*W))))
        py = y*H
        if alt[cx] is None or py < alt[cx]: alt[cx] = py
    ult = alt[0] if alt[0] is not None else H
    for i in range(W):
        if alt[i] is None: alt[i] = ult
        else: ult = alt[i]
    return alt

# ----------------------------------------------------------------- as formas
# Esquerda MAIOR e mais PERTO (mais escura). Direita menor e mais LONGE.
# A luz nasce atras da crista da esquerda, entao ela e quem ganha o fio de luz.
MORRO_PERTO = [(-.05,.62),(.06,.50),(.17,.47),(.30,.58),(.46,.74),(.66,.86),
               (.85,.93),(1.05,.97)]
MORRO_LONGE = [(-.05,.92),(.16,.88),(.38,.82),(.58,.75),(.78,.70),(.92,.72),
               (1.05,.78)]

GLOW = (.17, .46)          # atras da crista do morro da esquerda
AVIAO = (.50, .45, .125)   # x, y, largura em fracao do quadro

# ------------------------------------------------------------------- o ceu
# Feito pequeno e ampliado: degrade e brilho sao suaves, entao a interpolacao
# nao inventa nada e evita 2.7M de pixels em laco de python.
sw, sh = 300, 140
ceu = Image.new("RGB", (sw, sh))
cp = ceu.load()
for y in range(sh):
    f = y/sh
    # azul-preto profundo, clareando de leve para baixo
    r = int(8  + 16*f); g = int(11 + 20*f); b = int(20 + 30*f)
    for x in range(sw):
        cp[x, y] = (r, g, b)
# brilho frio baixo, do lado esquerdo
gx, gy = GLOW[0]*sw, GLOW[1]*sh
for y in range(sh):
    for x in range(sw):
        d = math.hypot((x-gx)/(sw*.42), (y-gy)/(sh*.60))
        i = max(0.0, 1-d)**2.4
        if i > .002:
            r, g, b = cp[x, y]
            cp[x, y] = (min(255,int(r+150*i)), min(255,int(g+152*i)), min(255,int(b+140*i)))
ceu = ceu.resize((W, H), Image.BICUBIC)
cd = ImageDraw.Draw(ceu)

# faixas finas de nuvem, pegando o brilho por baixo
faixa = Image.new("L", (sw, sh), 0); fp = faixa.load()
for i, (fy, esp, forca) in enumerate([(.42,2.0,54),(.55,1.4,44),(.66,1.1,34),(.30,2.6,28)]):
    for x in range(sw):
        yy = fy*sh + math.sin(x/sw*math.pi*(1.4+i*.5) + i)*sh*.022
        for dy in range(-int(esp*3), int(esp*3)+1):
            y = int(yy+dy)
            if 0 <= y < sh:
                v = forca*math.exp(-(dy/esp)**2) * max(.15, 1-abs(x/sw-GLOW[0])*1.3)
                fp[x, y] = min(255, fp[x, y]+int(v))
faixa = faixa.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(6))
ceu = Image.composite(Image.new("RGB",(W,H),(150,156,168)), ceu, faixa.point(lambda v: v//2))

# estrelas: poucas, fracas, e sumindo perto do brilho
for _ in range(240):
    x = random.randrange(W); y = random.randrange(int(H*.62))
    perto = 1 - min(1, math.hypot((x/W-GLOW[0])*1.5, (y/H-GLOW[1])))
    b = int(random.uniform(28, 96) * (1-perto*.85))
    if b > 12: cd.point((x, y), fill=(b, b, int(b*1.06)))

# --------------------------------------------------------------- os morros
def camada(pts, cor):
    alt = perfil(pts)
    cam = Image.new("RGBA", (W, H), (0,0,0,0))
    d = ImageDraw.Draw(cam)
    d.polygon([(0,H)] + [(x, alt[x]) for x in range(W)] + [(W-1,H)], fill=cor)
    return cam, alt

# perspectiva atmosferica: o de longe e mais claro e mais azul, nao so menor
longe, alt_longe = camada(MORRO_LONGE, (17, 21, 33, 255))
perto, alt_perto = camada(MORRO_PERTO, (6, 7, 12, 255))

# fio de luz na crista de quem tem o brilho atras
rim = Image.new("L", (W, H), 0); rd = ImageDraw.Draw(rim)
for x in range(W):
    d = abs(x/W - GLOW[0])
    i = max(0.0, 1 - d*2.6)**2
    if i > .01:
        rd.line([(x, alt_perto[x]-1), (x, alt_perto[x]+2)], fill=int(235*i))
rim = rim.filter(ImageFilter.GaussianBlur(2.2))

cena = ceu.convert("RGBA")
cena.alpha_composite(longe)

# o aviao mora ENTRE os morros: a crista do da frente pode cortar o pe dele
av = Image.open("/tmp/claude-1000/-home-gabfelix-dev-portfolio/aviao-esq.png")
aw = int(W*AVIAO[2]); ah = int(aw*av.size[1]/av.size[0])
av = av.resize((aw, ah), Image.LANCZOS).rotate(11, expand=True, resample=Image.BICUBIC)
cena.alpha_composite(av, (int(W*AVIAO[0]-av.size[0]/2), int(H*AVIAO[1]-av.size[1]/2)))

cena.alpha_composite(perto)
cena = Image.composite(Image.new("RGBA",(W,H),(196,204,220,255)), cena, rim)

# grao: sem ele o degrade escuro faz banding em tela grande
g = Image.effect_noise((W, H), 13).filter(ImageFilter.GaussianBlur(.4))
cena = Image.blend(cena.convert("RGB"), Image.merge("RGB",(g,g,g)), .028)

cena.save("/tmp/claude-1000/-home-gabfelix-dev-portfolio/campo.png")
for nome, im in (("ceu", ceu), ("longe", longe), ("perto", perto)):
    im.save(f"/tmp/claude-1000/-home-gabfelix-dev-portfolio/camada-{nome}.png")
print(f"cena {W}x{H} + 3 camadas soltas")
