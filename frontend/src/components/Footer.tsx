import { A } from "@solidjs/router";
import { Section } from "../shared/Section";
import { JSX } from "solid-js";

export type FooterProps = {};

export function Footer(_props: FooterProps) {
  return (
    <Section class="pb-24!">
      <footer class="grid grid-cols-3">
        <div class="py-md pl-2xl gap-xl flex flex-col items-start border-l border-neutral-300">
          <span class="mb-xl font-normal">Навигация</span>
          <FooterLink href="/databases">Базы данных</FooterLink>
          <FooterLink href="/projects">Проекты</FooterLink>
          <FooterLink href="/guides">Гайды</FooterLink>
          <FooterLink href="/signin">Профиль</FooterLink>
        </div>
        <div class="py-md pl-2xl gap-xl flex flex-col items-start border-l border-neutral-300">
          <span class="mb-xl font-normal">Колледж</span>
          <FooterLink href="/databases">Элжур</FooterLink>
          <FooterLink href="/projects">Финансовый университет</FooterLink>
        </div>
        <div class="py-md pl-2xl gap-xl flex flex-col items-start border-l border-neutral-300">
          <span class="mb-xl font-normal">О проекте</span>
          <p class="mb-xl leading-[150%] text-neutral-500">
            Проект разработан и выпущен под открытой лицензией{" "}
            <a class="text-neutral-700 underline" href="#">
              MIT
            </a>{" "}
            в рамках производственной практики в колледже{" "}
            <a class="text-neutral-700 underline" href="#">
              КИПФИН
            </a>
          </p>
          <FooterLink href="/databases">Репозиторий проекта</FooterLink>
          <FooterLink href="/projects">Разработчики</FooterLink>
        </div>
      </footer>
    </Section>
  );
}

type FooterLinkProps = {
  href: string;
  children: JSX.Element;
};

function FooterLink(props: FooterLinkProps) {
  return (
    <A
      href={props.href}
      class="text-neutral-600 hover:text-neutral-700 hover:underline"
    >
      {props.children}
    </A>
  );
}
