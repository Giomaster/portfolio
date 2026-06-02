# Portfolio — Giovanni Rios Martins

An interactive CV. A short story you can play through, ending in the actual CV. Built in vanilla HTML / CSS / JavaScript — no frameworks, no build step.

## About

- **Name:** Giovanni Rios Martins
- **Born:** 05/11/2002
- **Role:** Backend & Platform Engineer · Internal Developer Platforms
- **Experience:** Self-taught, shipping production software since 17 — six years end-to-end. Five years at Stone Pagamentos (junior → Backend Engineer II), one of the engineers who built their Internal Developer Platform, used by dozens of squads. Earlier: founding engineer at mech4u and freelance for SandreFrio (2019–2021). Now building the open-source control plane Yggdrasil.
- **Stack at a glance:** Go · TypeScript · Node.js · Python · SQL · Kubernetes · Terraform · Crossplane · Backstage · GitOps · Kustomize · NestJS · Django · PostgreSQL · Redis · AWS · Docker · CI/CD · IAM (OIDC/SAML/SCIM) · Observability

## The interactive flow

1. **Audio prompt** — opt-in to the soundtrack
2. **Chess** — a puzzle and the chess years (age 10)
3. **Anagram** — the tech origins (age 13, CryptoRave 2016 CTF)
4. **Flyblock** — what came after (startups + Stone)
5. **CV page** — skills, selected work, download the PDF, contact

The narrative tracks the timeline: chess at 10, code at 13, shipping production at 17, Stone in 2021, and now.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Or just open `index.html` directly via `file://`.

## CV (downloadable PDF)

`cv.pdf` in the repo root is the file served by the **Download CV** button (linked from `index.html` with `download="Giovanni-Rios-Martins-CV.pdf"`). To refresh it, replace `cv.pdf` with the latest export of the CV.


## Contact

- **Email:** giovanni.c.martins@gmail.com
- **LinkedIn:** [linkedin.com/in/giovanni-martins-762607268](https://www.linkedin.com/in/giovanni-martins-762607268/?locale=en_US)
- **GitHub:** [github.com/Giomaster](https://github.com/Giomaster)
