import Link from "next/link";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-bold text-foreground">{title}</h2>
      <div className="mt-3 flex flex-col gap-3 text-sm leading-7 text-muted">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
        <span className="rounded-full border border-white/10 bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
          Legal
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-muted-2">Effective date: August 22, 2026</p>

        <p className="mt-8 text-sm leading-7 text-muted">
          This Privacy Policy explains how True U LLC (&quot;True U Athletics,&quot;
          &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, and shares
          information when you use our website, quiz, saved stacks, and Coach AI assistant
          (collectively, the &quot;Service&quot;).
        </p>

        <Section title="1. Information We Collect">
          <p>
            <span className="font-medium text-foreground">Account information.</span> When you
            create an account, our authentication provider collects your email address and
            authentication credentials. We do not receive or store your password.
          </p>
          <p>
            <span className="font-medium text-foreground">Quiz answers.</span> To generate a
            supplement stack, we ask about your training focus and goals, training frequency,
            drug-tested status, biological sex, age range, diet, allergies/sensitivities,
            medication or medical conditions (yes/no only — we do not ask what the condition or
            medication is), sleep quality, and supplements you currently take. Some of this is
            health-adjacent information. It is used only to generate and personalize your
            recommendations and, if you choose to save a stack, to store that stack on your
            account.
          </p>
          <p>
            <span className="font-medium text-foreground">Coach conversations.</span> Messages you
            send to Coach, and Coach&apos;s responses, are processed by our AI provider to generate
            a reply and are used to enforce usage limits on your account (such as your remaining
            free questions).
          </p>
          <p>
            <span className="font-medium text-foreground">Payment information.</span> If you
            subscribe to a paid plan, our payment processor, Stripe, collects your payment card
            details directly. We never receive or store your full card number. We do store a
            reference to your Stripe customer and subscription record so we can manage your
            billing.
          </p>
          <p>
            <span className="font-medium text-foreground">Usage &amp; device data.</span> We use a
            small number of cookies to keep you signed in and to track anonymous quiz usage before
            you create an account (see Section 4).
          </p>
        </Section>

        <Section title="2. How We Use Your Information">
          <ul className="list-disc space-y-1 pl-5">
            <li>To generate and save your supplement stack recommendations;</li>
            <li>To provide Coach&apos;s responses to your questions;</li>
            <li>To create and secure your account and enforce plan limits;</li>
            <li>To process payments and manage subscriptions;</li>
            <li>To communicate with you about your account or the Service;</li>
            <li>To maintain the security and integrity of the Service; and</li>
            <li>To comply with legal obligations.</li>
          </ul>
          <p>We do not sell your personal information, and we do not use it for third-party advertising.</p>
        </Section>

        <Section title="3. How We Share Information">
          <p>We share information only with the service providers that help us run the Service:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <span className="font-medium text-foreground">Clerk</span> — authentication and
              account management.
            </li>
            <li>
              <span className="font-medium text-foreground">Stripe</span> — payment processing and
              subscription billing.
            </li>
            <li>
              <span className="font-medium text-foreground">Anthropic</span> — powers the Coach AI
              assistant; your Coach messages are sent to Anthropic to generate a response.
            </li>
          </ul>
          <p>
            We may also disclose information if required by law, to protect our rights or the
            safety of others, or in connection with a merger, acquisition, or sale of assets (in
            which case we will notify you).
          </p>
        </Section>

        <Section title="4. Cookies">
          <p>
            We use a small, essential set of cookies: an authentication session cookie (set by our
            authentication provider) and, for visitors who have not created an account, a cookie
            that records whether you have already used your free anonymous quiz attempt. We do not
            use third-party advertising or tracking cookies.
          </p>
        </Section>

        <Section title="5. Data Retention">
          <p>
            We retain account information and saved stacks for as long as your account is active.
            If you delete your account, we will delete your saved stacks and quiz answers within a
            reasonable time, except where we are required to retain certain records (such as
            billing history) for legal or accounting purposes.
          </p>
        </Section>

        <Section title="6. Your Rights &amp; Choices">
          <p>
            You can review and delete your saved stacks at any time from the{" "}
            <Link href="/stacks" className="text-accent hover:underline">
              My Stacks
            </Link>{" "}
            page. To request access to, correction of, or deletion of your personal information, or
            to close your account entirely, email us at{" "}
            <a href="mailto:team@trueusupplements.com" className="text-accent hover:underline">
              team@trueusupplements.com
            </a>
            . If you are a California resident or a resident of another state with a comprehensive
            privacy law, you may have additional rights under that law, including the right to
            know, delete, or opt out of certain processing of your personal information; you can
            exercise these rights using the same contact above.
          </p>
        </Section>

        <Section title="7. Children's Privacy">
          <p>
            The Service is not directed to, and we do not knowingly collect personal information
            from, anyone under the age of 18. As described in our{" "}
            <Link href="/terms" className="text-accent hover:underline">
              Terms of Service
            </Link>
            , accounts and paid plans require you to be at least 18. If we learn that we have
            collected personal information from someone under 18, we will delete it.
          </p>
        </Section>

        <Section title="8. Data Security">
          <p>
            We use reasonable technical and organizational measures to protect your information,
            and we rely on established providers (Clerk, Stripe, Anthropic) that maintain their own
            security programs. No method of transmission or storage is completely secure, and we
            cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. If we make material changes, we
            will post the updated policy here with a new effective date.
          </p>
        </Section>

        <Section title="10. Contact Us">
          <p>
            Questions about this Privacy Policy can be sent to{" "}
            <a href="mailto:team@trueusupplements.com" className="text-accent hover:underline">
              team@trueusupplements.com
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}
