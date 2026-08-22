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

export default function TermsPage() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
        <span className="rounded-full border border-white/10 bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
          Legal
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-muted-2">Effective date: August 22, 2026</p>

        <p className="mt-8 text-sm leading-7 text-muted">
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of the True U
          Athletics website, quiz, supplement stack recommendations, saved stacks, and the Coach AI
          assistant (collectively, the &quot;Service&quot;), operated by True U LLC (&quot;True U
          Athletics,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By creating an
          account, subscribing to a paid plan, or otherwise using the Service, you agree to be
          bound by these Terms. If you do not agree, do not use the Service.
        </p>

        <Section title="1. Eligibility">
          <p>
            You must be at least 18 years old to create an account, subscribe to a paid plan, or
            use Coach. The quiz will not generate supplement recommendations for anyone who
            identifies as under 18 in response to the age-range question, and will instead direct
            them to speak with a parent, guardian, or physician. If you are under 18, do not create
            an account or attempt to circumvent this restriction.
          </p>
        </Section>

        <Section title="2. Description of the Service">
          <p>
            True U Athletics provides a questionnaire-based tool that suggests general categories
            of dietary supplements based on the training information you provide, along with an
            AI-powered chat assistant (&quot;Coach&quot;) that answers general questions about
            supplements and training. The Service is offered at different account tiers (currently
            marketed as Basic, Amateur, and MVP), each with different feature limits that we may
            change from time to time as described on our pricing page.
          </p>
          <p>
            The Service is for general informational and educational purposes only. It is not a
            substitute for professional medical, nutritional, or athletic advice. See our{" "}
            <Link href="/disclaimer" className="text-accent hover:underline">
              Health &amp; Supplement Disclaimer
            </Link>{" "}
            for important information you should read before using the Service.
          </p>
        </Section>

        <Section title="3. Accounts">
          <p>
            Account registration and authentication are handled by our third-party identity
            provider. You are responsible for maintaining the confidentiality of your login
            credentials and for all activity that occurs under your account. You agree to provide
            accurate information and to notify us promptly at{" "}
            <a href="mailto:team@trueusupplements.com" className="text-accent hover:underline">
              team@trueusupplements.com
            </a>{" "}
            if you suspect unauthorized use of your account.
          </p>
        </Section>

        <Section title="4. Subscriptions, Billing &amp; Cancellation">
          <p>
            Paid subscriptions (currently the MVP plan) are billed on a recurring monthly basis
            through our payment processor, Stripe, at the price displayed at the time you
            subscribe. By subscribing, you authorize us to charge your payment method on a
            recurring basis until you cancel.
          </p>
          <p>
            You may cancel your subscription at any time through the &quot;Manage billing&quot;
            option in your account menu. Cancellation takes effect at the end of your current
            billing period, and you will retain access to paid features through that date. Except
            where required by law, payments are non-refundable, including for partial billing
            periods or unused features.
          </p>
          <p>
            We may change subscription pricing or feature limits (including daily stack-generation
            limits, saved-stack limits, and Coach access) at any time. If we increase pricing on an
            active subscription, we will provide reasonable notice before the change takes effect.
          </p>
        </Section>

        <Section title="5. Acceptable Use">
          <p>You agree not to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Use the Service for any unlawful purpose or in violation of these Terms;</li>
            <li>
              Attempt to reverse engineer, scrape, or extract data from the Service other than your
              own account data;
            </li>
            <li>Circumvent account tier limits, usage limits, or access controls;</li>
            <li>Impersonate any person or entity or misrepresent your affiliation with anyone;</li>
            <li>
              Use Coach or any part of the Service to generate content that is unlawful, harmful,
              or infringing.
            </li>
          </ul>
          <p>
            We may suspend or terminate accounts that violate these Terms, at our discretion, with
            or without notice.
          </p>
        </Section>

        <Section title="6. AI-Generated Content">
          <p>
            Coach is powered by a third-party large language model. Responses are generated
            automatically and are not reviewed by a medical professional, registered dietitian, or
            any human before being shown to you. Coach&apos;s responses may be incomplete,
            outdated, or incorrect. You should independently verify any information before relying
            on it, and you should not disregard or delay seeking professional medical advice
            because of something Coach told you.
          </p>
        </Section>

        <Section title="7. Intellectual Property">
          <p>
            The Service, including its design, text, graphics, logos, and underlying software
            (excluding any content generated specifically for you by Coach), is owned by True U LLC
            or its licensors and is protected by intellectual property laws. Your subscription
            grants you a limited, non-exclusive, non-transferable license to use the Service for
            your personal, non-commercial use — it does not grant you any ownership interest in
            the Service itself.
          </p>
        </Section>

        <Section title="8. Third-Party Services">
          <p>
            The Service relies on third-party providers, including for authentication, payment
            processing, and AI chat functionality. We are not responsible for the acts, omissions,
            or downtime of these third parties, though we select providers we believe are
            reputable.
          </p>
        </Section>

        <Section title="9. Disclaimer of Warranties">
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE,&quot; WITHOUT
            WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT
            WARRANT THAT SUPPLEMENT RECOMMENDATIONS OR COACH RESPONSES WILL BE ACCURATE, COMPLETE,
            OR SUITABLE FOR YOUR INDIVIDUAL CIRCUMSTANCES.
          </p>
        </Section>

        <Section title="10. Limitation of Liability">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, TRUE U LLC AND ITS OWNERS, EMPLOYEES, AND
            CONTRACTORS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
            PUNITIVE DAMAGES, OR ANY LOSS OF HEALTH, PROFITS, OR DATA, ARISING FROM YOUR USE OF THE
            SERVICE OR ANY SUPPLEMENT YOU CHOOSE TO TAKE, EVEN IF WE HAVE BEEN ADVISED OF THE
            POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF THESE
            TERMS OR THE SERVICE WILL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS BEFORE THE
            CLAIM AROSE.
          </p>
        </Section>

        <Section title="11. Indemnification">
          <p>
            You agree to indemnify and hold harmless True U LLC from any claims, damages, or
            expenses (including reasonable attorneys&apos; fees) arising from your use of the
            Service, your violation of these Terms, or your decision to take any supplement,
            whether or not recommended by the Service.
          </p>
        </Section>

        <Section title="12. Termination">
          <p>
            You may stop using the Service and delete your account at any time. We may suspend or
            terminate your access to the Service if we reasonably believe you have violated these
            Terms. Sections of these Terms that by their nature should survive termination
            (including Sections 9–11 and 13) will survive.
          </p>
        </Section>

        <Section title="13. Governing Law &amp; Disputes">
          <p>
            These Terms are governed by the laws of the State of Kansas, without regard to its
            conflict-of-laws principles. Any dispute arising out of or relating to these Terms or
            the Service will be subject to the exclusive jurisdiction of the state and federal
            courts located in Kansas, and you consent to personal jurisdiction there.
          </p>
        </Section>

        <Section title="14. Changes to These Terms">
          <p>
            We may update these Terms from time to time. If we make material changes, we will post
            the updated Terms on this page with a new effective date. Continued use of the Service
            after changes take effect constitutes acceptance of the updated Terms.
          </p>
        </Section>

        <Section title="15. Contact Us">
          <p>
            Questions about these Terms can be sent to{" "}
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
