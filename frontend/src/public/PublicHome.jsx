/* ===== HOME PREMIUM COM IMAGENS ===== */

.heroImageWrap{
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
  min-height:680px;
}

.heroImageGlow{
  position:absolute;
  width:520px;
  height:520px;
  border-radius:50%;
  background:rgba(216,180,90,.18);
  filter:blur(90px);
}

.heroDogImage{
  position:relative;
  z-index:2;
  width:100%;
  max-width:620px;
  object-fit:contain;
  filter:drop-shadow(0 40px 70px rgba(0,0,0,.45));
  animation:floatDog 5s ease-in-out infinite;
}

.heroFloatingCard{
  position:absolute;
  bottom:30px;
  right:0;
  z-index:4;
  width:280px;
  padding:24px;
  border-radius:28px;
  background:rgba(9,25,20,.82);
  border:1px solid rgba(255,255,255,.08);
  backdrop-filter:blur(18px);
  box-shadow:0 20px 60px rgba(0,0,0,.35);
}

.heroStars{
  display:flex;
  gap:4px;
  color:var(--gold2);
  margin-bottom:12px;
}

.heroFloatingCard strong,
.heroFloatingCard span{
  display:block;
}

.heroFloatingCard span{
  margin-top:8px;
  color:var(--muted);
  line-height:1.6;
}

.serviceImageGrid{
  grid-template-columns:repeat(3,minmax(0,1fr));
}

.serviceImageCard{
  padding:0;
  overflow:hidden;
}

.serviceImageCard img{
  width:100%;
  height:230px;
  object-fit:cover;
  display:block;
}

.serviceImageCard > div{
  padding:24px;
}

.aboutPremiumGrid{
  display:grid;
  grid-template-columns:1.1fr .9fr;
  gap:20px;
  align-items:stretch;
}

.aboutImage{
  width:100%;
  height:100%;
  min-height:420px;
  object-fit:cover;
  border-radius:28px;
  border:1px solid rgba(255,255,255,.08);
  box-shadow:var(--shadow);
}

.testimonialPremiumGrid{
  display:grid;
  grid-template-columns:1.1fr .9fr;
  gap:20px;
  align-items:stretch;
}

.testimonialCards{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:16px;
}

.testimonialPremiumGrid > img{
  width:100%;
  height:100%;
  min-height:320px;
  object-fit:cover;
  border-radius:28px;
  border:1px solid rgba(255,255,255,.08);
}

.homeGalleryGrid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:16px;
}

.homeGalleryItem{
  height:260px;
  border-radius:26px;
  overflow:hidden;
  border:1px solid rgba(255,255,255,.08);
  box-shadow:var(--shadow);
}

.homeGalleryItem img{
  width:100%;
  height:100%;
  object-fit:cover;
  transition:.35s ease;
}

.homeGalleryItem:hover img{
  transform:scale(1.08);
}

.premiumFooter{
  display:grid;
  grid-template-columns:1.2fr 1fr 1fr;
  gap:30px;
}

.premiumFooter div{
  display:flex;
  flex-direction:column;
  gap:8px;
}

.mobileBookingCta{
  display:none;
}

@keyframes floatDog{
  0%{transform:translateY(0)}
  50%{transform:translateY(-14px)}
  100%{transform:translateY(0)}
}

@media(max-width:1100px){
  .heroImageWrap{
    min-height:auto;
  }

  .heroDogImage{
    max-width:480px;
  }

  .aboutPremiumGrid,
  .testimonialPremiumGrid{
    grid-template-columns:1fr;
  }

  .testimonialCards,
  .homeGalleryGrid,
  .serviceImageGrid{
    grid-template-columns:1fr;
  }

  .premiumFooter{
    grid-template-columns:1fr;
  }
}

@media(max-width:760px){
  .heroFloatingCard{
    position:relative;
    right:auto;
    bottom:auto;
    width:100%;
    margin-top:-30px;
  }

  .mobileBookingCta{
    position:fixed;
    left:16px;
    right:16px;
    bottom:16px;
    z-index:100;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:8px;
    border:none;
    padding:15px 18px;
    border-radius:18px;
    background:linear-gradient(135deg,var(--gold),var(--gold2));
    color:#11251b;
    font-weight:900;
    box-shadow:0 20px 60px rgba(0,0,0,.45);
  }

  .publicFooter{
    padding-bottom:92px;
  }
}
