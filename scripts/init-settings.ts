import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const aboutContent = `안녕하세요! 👋 저는 **뽀또**라고 불리는 개발자 Yooh입니다.

이 블로그는 제가 개발자로, 그리고 평생 학습자로 성장하는 과정을 기록하는 공간입니다. **공유를 통한 학습**을 믿어요 - 글을 쓰면 생각이 정리되고, 같은 길을 걷는 누군가에게도 도움이 되길 바라는 마음으로 기록합니다.

## 이런 글들을 씁니다

- 💻 **개발 경험**과 기술적인 인사이트
- 📚 **배우고 있는 것들**과 공부 기록
- 🌱 **개인적인 성장**과 회고
- 🎯 **진행 중인 프로젝트** 이야기

## 왜 "뽀또공장"?

뭔가를 만드는 곳이라는 뜻입니다 - 코드도 만들고, 아이디어도 만들고요. 매일매일의 배움과 호기심, 그리고 실험들이 모여 하나씩 만들어집니다.

개발이나 학습, 또는 그냥 이런저런 이야기 나누고 싶으시면 언제든 연락주세요!

---

*하루하루 기록하며 성장합니다* 🚀`;

  const settings = await prisma.siteSetting.upsert({
    where: { id: "default" },
    update: {
      siteTitle: "Bboddo's Factory",
      siteDescription: "Developer, Learner, and Life Logger",
      homeHeroTitle: "Welcome to my space 👋",
      homeHeroSubtitle: "Developer, Learner, and Life Logger",
      aboutTitle: "안녕하세요 👋",
      aboutSubtitle: "개발자, 학습자, 기록자",
      aboutContent: aboutContent,
      githubUrl: "https://github.com/yhyuntak",
      linkedinUrl: "https://www.linkedin.com/in/hyuntak-yoo-1628a7243/",
      emailAddress: "yhyuntak@gmail.com",
      footerText: "하루하루 기록하며 성장합니다",
    },
    create: {
      id: "default",
      siteTitle: "Bboddo's Factory",
      siteDescription: "Developer, Learner, and Life Logger",
      homeHeroTitle: "Welcome to my space 👋",
      homeHeroSubtitle: "Developer, Learner, and Life Logger",
      aboutTitle: "안녕하세요 👋",
      aboutSubtitle: "개발자, 학습자, 기록자",
      aboutContent: aboutContent,
      githubUrl: "https://github.com/yhyuntak",
      linkedinUrl: "https://www.linkedin.com/in/hyuntak-yoo-1628a7243/",
      emailAddress: "yhyuntak@gmail.com",
      footerText: "하루하루 기록하며 성장합니다",
    },
  });

  console.log("✅ Site settings initialized:");
  console.log(settings);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
