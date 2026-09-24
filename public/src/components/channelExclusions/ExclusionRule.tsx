import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { ExclusionRule as ExclusionRuleType, ExclusionSettings } from '../../models/exclusions';
import { SectionsEditor } from '../channelManagement/epicTests/sectionsEditor';
import { TagsEditor } from '../channelManagement/epicTests/tagsEditor';
import ContentTypesSelector from './ContentTypesSelector';
import RuleHeader from './RuleHeader';
import { useExclusionRuleHandlers } from './useExclusionRuleHandlers';
import { ChannelKey } from './util';

const FullRowField = styled('div')({ flex: '1 1 100%' });
const FullRowAlert = styled(Alert)({ flex: '1 1 100%' });
const Field = styled(TextField)({ flex: '1 0 200px' });

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: 'transparent',
}));

const RuleFields = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}));

const DateRange = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flex: '1 1 100%',
}));

const NETWORK_FRONTS = [
  { id: 'uk', name: 'UK' },
  { id: 'us', name: 'US' },
  { id: 'au', name: 'Australia' },
  { id: 'europe', name: 'Europe' },
  { id: 'international', name: 'International' },
];

interface ExclusionRuleProps {
  channel: ChannelKey;
  label: string;
  data: ExclusionSettings;
  index: number;
  rule: ExclusionRuleType;
  canEdit: boolean;
  saving: boolean;
  onUpdateSettings: (settings: ExclusionSettings) => void;
  onPersistSettings: (settings: ExclusionSettings) => void;
}

const ExclusionRule: React.FC<ExclusionRuleProps> = ({
  channel,
  label,
  data,
  index,
  rule,
  canEdit,
  saving,
  onUpdateSettings,
  onPersistSettings,
}) => {
  const {
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
  } = useExclusionRuleHandlers({
    channel,
    label,
    data,
    onUpdateSettings,
    onPersistSettings,
    index,
    rule,
  });

  return (
    <form>
      <StyledAccordion
        key={index}
        disableGutters
        expanded={isExpanded}
        onChange={(_, expanded) => setIsExpanded(expanded)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <RuleHeader
            state={{
              rule: formRule,
              index,
              editMode: isRuleInEditMode,
              isUnsaved: isRuleUnsaved,
              canEdit,
              saving,
              touchedNameFields,
            }}
            handlers={{
              onUpdateRule: handleUpdateRuleWithIndex,
              onStartEditRule: handleStartEditRule,
              onSaveRule: handleSaveRule,
              onCancelRule: handleCancelRule,
              onDeleteRule: handleDeleteRule,
              onNameBlur: handleNameBlur,
            }}
          />
        </AccordionSummary>
        <AccordionDetails>
          <RuleFields>
            <ContentTypesSelector
              rule={formRule}
              index={index}
              channel={channel}
              editMode={isRuleInEditMode}
              onUpdateRule={handleUpdateRuleWithIndex}
            />
            <FullRowAlert severity="info">
              Pages for this exclusion are determined by Section IDs <strong>OR</strong> Tag IDs
              <strong> OR</strong> Front IDs. If any list matches, the rule exclusion will apply.
            </FullRowAlert>
            <FullRowField>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Section IDs
              </Typography>
              {!isRuleInEditMode && (!formRule.sectionIds || formRule.sectionIds.length === 0) ? (
                <Typography variant="body2" color="textSecondary">
                  No section IDs
                </Typography>
              ) : (
                <SectionsEditor
                  label="Section IDs"
                  ids={formRule.sectionIds ?? []}
                  onUpdate={(ids) => handleRuleChange({ ...formRule, sectionIds: ids })}
                  disabled={!isRuleInEditMode}
                />
              )}
            </FullRowField>
            <FullRowField>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Tag IDs
              </Typography>
              {!isRuleInEditMode && (!formRule.tagIds || formRule.tagIds.length === 0) ? (
                <Typography variant="body2" color="textSecondary">
                  No tag IDs
                </Typography>
              ) : (
                <TagsEditor
                  label="Tag IDs"
                  ids={formRule.tagIds ?? []}
                  onUpdate={(ids) => handleRuleChange({ ...formRule, tagIds: ids })}
                  disabled={!isRuleInEditMode}
                />
              )}
            </FullRowField>
            <FullRowField>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Network Fronts
              </Typography>
              {!isRuleInEditMode && (!formRule.frontIds || formRule.frontIds.length === 0) ? (
                <Typography variant="body2" color="textSecondary">
                  No network fronts selected
                </Typography>
              ) : (
                <FormGroup row>
                  {NETWORK_FRONTS.map((front) => (
                    <FormControlLabel
                      key={front.id}
                      control={
                        <Checkbox
                          checked={formRule.frontIds?.includes(front.id) ?? false}
                          onChange={(e) => {
                            const currentIds = formRule.frontIds ?? [];
                            const updatedIds = e.target.checked
                              ? [...currentIds, front.id]
                              : currentIds.filter((id) => id !== front.id);
                            handleRuleChange({
                              ...formRule,
                              frontIds: updatedIds.length > 0 ? updatedIds : undefined,
                            });
                          }}
                          disabled={!isRuleInEditMode}
                          size="small"
                        />
                      }
                      label={front.name}
                    />
                  ))}
                </FormGroup>
              )}
            </FullRowField>
          </RuleFields>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Date Range{' '}
            <small>
              (The selected channel is suppressed during this period. Start and end dates are
              inclusive.)
            </small>
          </Typography>
          <DateRange>
            <Field
              label="Start Date"
              type="date"
              value={formRule.dateRange?.start ?? ''}
              onChange={(e) =>
                handleRuleChange({
                  ...formRule,
                  dateRange: e.target.value
                    ? { start: e.target.value, end: formRule.dateRange?.end ?? '' }
                    : undefined,
                })
              }
              variant="outlined"
              size="small"
              disabled={!isRuleInEditMode}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Field
              label="End Date"
              type="date"
              value={formRule.dateRange?.end ?? ''}
              onChange={(e) =>
                handleRuleChange({
                  ...formRule,
                  dateRange: e.target.value
                    ? { start: formRule.dateRange?.start ?? '', end: e.target.value }
                    : undefined,
                })
              }
              variant="outlined"
              size="small"
              disabled={!isRuleInEditMode}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DateRange>
        </AccordionDetails>
      </StyledAccordion>
    </form>
  );
};

export default ExclusionRule;
