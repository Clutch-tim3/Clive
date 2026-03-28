'use client';
import React from 'react';
import { SaturnIcon } from './SaturnIcon';
import { HackKitIcon } from './HackKitIcon';
import { EmbedCoreIcon } from './EmbedCoreIcon';
import { ShieldKitIcon } from './ShieldKitIcon';
import { SearchCoreIcon } from './SearchCoreIcon';
import { TenderIQIcon } from './TenderIQIcon';
import { ContractIQIcon } from './ContractIQIcon';
import { MeetingIQIcon } from './MeetingIQIcon';
import { FXBridgeIcon } from './FXBridgeIcon';
import { DevKitIcon } from './DevKitIcon';
import { WealthMindIcon } from './WealthMindIcon';
import { VoicePostIcon } from './VoicePostIcon';
import { PayGradeIcon } from './PayGradeIcon';
import { FlowMapperIcon } from './FlowMapperIcon';
import { TalentPulseIcon } from './TalentPulseIcon';

interface ProductIconProps {
  slug: string;
  size?: number;
  className?: string;
}

export function ProductIcon({ slug, size = 44, className = '' }: ProductIconProps) {
  const style = { width: size, height: size };

  switch (slug) {
    case 'saturn':
    case 'clive':
      return <SaturnIcon style={style} className={className} />;
    case 'hackkit':
      return <HackKitIcon style={style} className={className} />;
    case 'embedcore':
      return <EmbedCoreIcon style={style} className={className} />;
    case 'shieldkit':
      return <ShieldKitIcon style={style} className={className} />;
    case 'searchcore':
      return <SearchCoreIcon style={style} className={className} />;
    case 'tenderiq':
      return <TenderIQIcon style={style} className={className} />;
    case 'contractiq':
      return <ContractIQIcon style={style} className={className} />;
    case 'meetingiq':
      return <MeetingIQIcon style={style} className={className} />;
    case 'fxbridge':
      return <FXBridgeIcon style={style} className={className} />;
    case 'devkit':
      return <DevKitIcon style={style} className={className} />;
    case 'wealthmind':
      return <WealthMindIcon style={style} className={className} />;
    case 'voicepost':
      return <VoicePostIcon style={style} className={className} />;
    case 'paygrade':
      return <PayGradeIcon style={style} className={className} />;
    case 'flowmapper':
      return <FlowMapperIcon style={style} className={className} />;
    case 'talentpulse':
      return <TalentPulseIcon style={style} className={className} />;
    default:
      return null;
  }
}
