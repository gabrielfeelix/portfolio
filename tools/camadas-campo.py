#!/usr/bin/env python3
"""Prepara as camadas da quebra: recorta alpha, tira franja e exporta webp.

Cada asset chega como PNG com fundo chapado, porque gerador de imagem nao
entrega alpha confiavel. O fundo escolhido nao foi por acaso:

  morros, aviao -> BRANCO. Verde e vermelho sobre branco separam bem, e a
                   parte sombreada do morro continua escura sem risco de ser
                   confundida com o fundo.
  lua           -> PRETO. Ela e uma FONTE DE LUZ com halo: recortar halo em
                   alpha sempre deixa borda. Sobre preto ela entra com
                   `mix-blend-mode: screen`, que e como luz se soma de verdade
                   — o preto some sozinho e o halo funde sem costura nenhuma.
                   Por isso a lua nao tem alpha e nao precisa.
  ceu           -> nenhum. E a camada do fundo.

A DESFRANJA importa mais do que parece. A borda anti-serrilhada de qualquer
recorte mistura objeto com fundo; sobre branco isso vira um fio claro em volta
do morro, e o destino dele e um ceu escuro, onde fio claro le como recorte mal
feito. A conta desfaz a mistura: se o pixel observado e C = a*Real + (1-a)*255,
entao Real = (C - (1-a)*255) / a.
"""
import os
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENT = os.path.join(RAIZ, "uploads")
SAI = os.path.join(RAIZ, "volume/assets/campo")
os.makedirs(SAI, exist_ok=True)

def recorta_branco(im, limiar=8, ganho=7.0):
    im = im.convert("RGB"); w, h = im.size; p = im.load()
    a = Image.new("L", (w, h), 0); ap = a.load()
    for y in range(h):
        for x in range(w):
            r, g, b = p[x, y]
            d = 255 - min(r, g, b)          # 0 no branco puro
            v = (d - limiar) * ganho
            ap[x, y] = 0 if v <= 0 else (255 if v >= 255 else int(v))
    out = im.convert("RGBA"); op = out.load()
    for y in range(h):                       # desfranja
        for x in range(w):
            al = ap[x, y]
            if 0 < al < 250:
                f = al / 255
                r, g, b = p[x, y]
                op[x, y] = (
                    max(0, min(255, int((r - (1-f)*255) / f))),
                    max(0, min(255, int((g - (1-f)*255) / f))),
                    max(0, min(255, int((b - (1-f)*255) / f))), al)
            else:
                op[x, y] = (*p[x, y], al)
    return out

def noite(im, k=(.60,.71,.82)):
    """Graduacao de noite no morro.

    O gerador entrega o verde no valor de dia — luminoso e amarelado — mesmo
    tendo desenhado um ceu noturno atras. Composto sobre o ceu escuro ele le
    como grama de meio-dia recortada e colada, e denuncia a montagem.

    Os tres fatores nao sao iguais de proposito: o vermelho cai mais e o azul
    cai menos. Luz de lua e fria, entao escurecer por igual daria um verde
    apenas mais escuro; puxando o azul junto o verde vira esverdeado-frio, que
    e a cor que grama tem debaixo de lua. A sombra continua sendo sombra e o
    fio de luz na crista continua sendo o mais claro do morro. */"""
    p = im.load()
    for y in range(im.size[1]):
        for x in range(im.size[0]):
            r, g, b, a = p[x, y]
            if a:
                p[x, y] = (int(r*k[0]), int(g*k[1]), int(b*k[2]), a)
    return im

def alonga(im, fator=1.0):
    """Estica cada coluna do morro para baixo, a partir do pixel opaco mais baixo.

    O recorte termina na caixa do alpha, entao o pe do morro e um CORTE RETO. Ele
    fica fora da tela enquanto a camada esta parada, mas o parallax sobe a camada
    — e quanto mais forte o parallax, mais ele sobe. No celular o Gabriel viu
    exatamente isso: a borda de baixo aparecendo, e o morro parecendo voar.

    Nao da para resolver no CSS: um retangulo de cor chapada por baixo denuncia a
    emenda contra a textura de grama, e limitar o curso do parallax e desistir do
    efeito. Entao a correcao e no arquivo — cada coluna continua para baixo com a
    cor do proprio pixel mais baixo dela, o que para uma silhueta de morro e
    simplesmente o morro sendo mais fundo. Coluna que nunca teve morro continua
    vazia, porque ali nao ha morro para continuar.

    O fator 1.0 dobra a altura. Parece exagero e nao e: e cor lisa, entao o webp
    custa quase nada, e a folga tem que ser maior que o curso do parallax da
    camada mais rapida — hoje 210px."""
    w, h = im.size
    extra = int(h * fator)
    nova = Image.new("RGBA", (w, h + extra), (0, 0, 0, 0))
    nova.paste(im, (0, 0))
    p = im.load(); n = nova.load()
    for x in range(w):
        base = None
        for y in range(h - 1, -1, -1):
            if p[x, y][3] > 200:
                base = p[x, y]
                break
        if base is None:
            continue
        for y in range(h, h + extra):
            n[x, y] = base
    return nova

def corta_vazio(im):
    bb = im.getchannel("A").point(lambda v: 255 if v > 6 else 0).getbbox()
    # largura inteira preservada: o morro tem que sangrar nas duas bordas
    return im.crop((0, bb[1], im.size[0], bb[3]))

def grava(im, nome, larg, q=90):
    if im.size[0] != larg:
        im = im.resize((larg, round(larg*im.size[1]/im.size[0])), Image.LANCZOS)
    d = os.path.join(SAI, nome + ".webp")
    im.save(d, "WEBP", quality=q, method=6)
    print(f"  {nome:12} {im.size[0]}x{im.size[1]:<5} {os.path.getsize(d)//1024:>4}KB"
          f"  {'alpha' if im.mode=='RGBA' else 'opaca'}")
    return im

print("camadas:")
grava(Image.open(f"{ENT}/ceu-parallax.png").convert("RGB"), "ceu", 2560)
grava(Image.open(f"{ENT}/lua-parallax.png").convert("RGB"), "lua", 900)

for ent, nome in (("morro1", "morro-perto"), ("morro2", "morro-longe")):
    im = alonga(corta_vazio(noite(recorta_branco(Image.open(f"{ENT}/{ent}-parallax.png")))))
    grava(im, nome, 2560)

av = recorta_branco(Image.open(f"{ENT}/aviao-parallax.png"))
bb = av.getchannel("A").point(lambda v: 255 if v > 6 else 0).getbbox()
grava(av.crop(bb), "aviao", 900)      # este corta nos quatro lados
