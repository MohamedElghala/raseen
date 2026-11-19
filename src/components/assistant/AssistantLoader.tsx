'use client';

import dynamic from 'next/dynamic';

const RaseenAssistant = dynamic(
  () => import('@/components/assistant/RaseenAssistant'),
  { ssr: false }
);

export default function AssistantLoader() {
  return <RaseenAssistant />;
}
