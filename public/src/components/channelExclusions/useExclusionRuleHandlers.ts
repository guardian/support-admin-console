import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ExclusionRule as ExclusionRuleType, ExclusionSettings } from '../../models/exclusions';
import { ChannelKey, validateRule } from './util';

interface ExclusionRuleFormValues {
  rule: ExclusionRuleType;
}

interface UseExclusionRuleHandlersParams {
  channel: ChannelKey;
  label: string;
  data: ExclusionSettings;
  onUpdateSettings: (settings: ExclusionSettings) => void;
  onPersistSettings: (settings: ExclusionSettings) => void;
  index: number;
  rule: ExclusionRuleType;
}

interface UseExclusionRuleHandlersReturn {
  formRule: ExclusionRuleType;
  isExpanded: boolean;
  isRuleInEditMode: boolean;
  isRuleUnsaved: boolean;
  touchedNameFields: Set<number>;
  setIsExpanded: (expanded: boolean) => void;
  handleNameBlur: () => void;
  handleStartEditRule: () => void;
  handleSaveRule: () => void;
  handleCancelRule: () => void;
  handleDeleteRule: () => void;
  handleRuleChange: (updatedRule: ExclusionRuleType) => void;
  handleUpdateRuleWithIndex: (_idx: number, updatedRule: ExclusionRuleType) => void;
}

export const useExclusionRuleHandlers = ({
  channel,
  label,
  data,
  onUpdateSettings,
  onPersistSettings,
  index,
  rule,
}: UseExclusionRuleHandlersParams): UseExclusionRuleHandlersReturn => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRuleInEditMode, setIsRuleInEditMode] = useState(!rule.name?.trim());
  const [isRuleUnsaved, setIsRuleUnsaved] = useState(!rule.name?.trim());
  const [savedRule, setSavedRule] = useState<ExclusionRuleType>(rule);
  const [touchedNameFields, setTouchedNameFields] = useState<Set<number>>(new Set());
  const { watch, reset, setValue } = useForm<ExclusionRuleFormValues>({
    defaultValues: { rule },
  });
  const formRule = watch('rule');

  useEffect(() => {
    reset({ rule });
  }, [rule, reset]);

  useEffect(() => {
    setSavedRule(rule);
  }, [index, rule]);

  const handleNameBlur = () => {
    setTouchedNameFields((prev) => new Set(prev).add(index));
  };

  const updateRuleInSettings = (updatedRule: ExclusionRuleType, persist: boolean) => {
    const currentRules = data[channel]?.rules ?? [];
    const nextRules = [...currentRules];
    nextRules[index] = updatedRule;
    const updatedSettings = {
      ...data,
      [channel]: { rules: nextRules },
    };
    if (persist) {
      onPersistSettings(updatedSettings);
      return;
    }
    onUpdateSettings(updatedSettings);
  };

  const handleStartEditRule = () => setIsRuleInEditMode(true);

  const handleSaveRule = () => {
    const validationError = validateRule(formRule, label, index);
    if (validationError) {
      alert(validationError);
      return;
    }

    setSavedRule(formRule);
    setIsRuleUnsaved(false);
    setIsRuleInEditMode(false);
    updateRuleInSettings(formRule, true);
  };

  const handleCancelRule = () => {
    const savedRuleIsEmpty = !savedRule.name?.trim();
    const currentRules = data[channel]?.rules ?? [];

    if (savedRuleIsEmpty) {
      const nextRules = currentRules.filter((_, i) => i !== index);
      const updatedSettings = {
        ...data,
        [channel]: { rules: nextRules },
      };
      onUpdateSettings(updatedSettings);
      return;
    }

    setValue('rule', savedRule, { shouldDirty: false });
    setIsRuleUnsaved(false);
    setIsRuleInEditMode(false);
    updateRuleInSettings(savedRule, false);
  };

  const handleDeleteRule = () => {
    const currentRules = data[channel]?.rules ?? [];
    const nextRules = currentRules.filter((_, i) => i !== index);
    const updatedSettings = {
      ...data,
      [channel]: { rules: nextRules },
    };
    onPersistSettings(updatedSettings);
  };

  const handleRuleChange = (updatedRule: ExclusionRuleType) => {
    setIsRuleInEditMode(true);
    setIsRuleUnsaved(true);
    setValue('rule', updatedRule, { shouldDirty: true });
    updateRuleInSettings(updatedRule, false);
  };

  const handleUpdateRuleWithIndex = (_idx: number, updatedRule: ExclusionRuleType) => {
    handleRuleChange(updatedRule);
  };

  return {
    formRule,
    isExpanded,
    isRuleInEditMode,
    isRuleUnsaved,
    touchedNameFields,
    setIsExpanded,
    handleNameBlur,
    handleStartEditRule,
    handleSaveRule,
    handleCancelRule,
    handleDeleteRule,
    handleRuleChange,
    handleUpdateRuleWithIndex,
  };
};
