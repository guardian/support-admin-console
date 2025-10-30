import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, CircularProgress, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PromoEditor from './promoEditor';
import { Promo } from './utils/promoModels';
import { fetchPromo, lockPromo, unlockPromo, updatePromo } from '../../utils/requests';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    padding: spacing(3),
    maxWidth: 1200,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: spacing(3),
    gap: spacing(2),
  },
  backButton: {
    minWidth: 'auto',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
}));

const PromoEditorPage: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { campaignCode, promoCode } = useParams<{ campaignCode: string; promoCode: string }>();
  const [promo, setPromo] = useState<Promo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    if (promoCode) {
      fetchPromo(promoCode)
        .then(response => {
          setPromo(response.promo);
          setUserEmail(response.userEmail);
        })
        .catch(error => {
          console.error('Error fetching promo:', error);
          alert(`Error fetching promo: ${error.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [promoCode]);

  const handleBack = () => {
    navigate(`/promo-tool/${campaignCode}`);
  };

  const handleEditPromo = () => {
    if (promo) {
      lockPromo(promo.promoCode, false)
        .then(() => {
          setIsEditing(true);
          return fetchPromo(promo.promoCode);
        })
        .then(response => {
          setPromo(response.promo);
        })
        .catch(error => {
          setIsEditing(false);
          alert(`Error locking promo: ${error.message}`);
        });
    }
  };

  const handleLockPromo = (force: boolean) => {
    if (promo) {
      lockPromo(promo.promoCode, force)
        .then(() => {
          setIsEditing(true);
          return fetchPromo(promo.promoCode);
        })
        .then(response => {
          setPromo(response.promo);
        })
        .catch(error => {
          setIsEditing(false);
          alert(`Error locking promo: ${error.message}`);
        });
    }
  };

  const handleUnlockPromo = () => {
    if (promo) {
      unlockPromo(promo.promoCode)
        .then(() => {
          setIsEditing(false);
          return fetchPromo(promo.promoCode);
        })
        .then(response => {
          setPromo(response.promo);
        })
        .catch(error => {
          alert(`Error unlocking promo: ${error.message}`);
        });
    }
  };

  const handleSavePromo = (updatedPromo: Promo) => {
    updatePromo(updatedPromo)
      .then(() => {
        setIsEditing(false);
        return fetchPromo(updatedPromo.promoCode);
      })
      .then(response => {
        setPromo(response.promo);
      })
      .catch(error => {
        alert(`Error saving promo: ${error.message}`);
      });
  };

  const handleCancelEdit = () => {
    if (promo) {
      unlockPromo(promo.promoCode)
        .then(() => {
          setIsEditing(false);
          return fetchPromo(promo.promoCode);
        })
        .then(response => {
          setPromo(response.promo);
        })
        .catch(error => {
          console.error('Error unlocking promo:', error);
          setIsEditing(false);
        });
    }
  };

  if (loading) {
    return (
      <div className={classes.container}>
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  if (!promo) {
    return (
      <div className={classes.container}>
        <Typography variant="h6" color="error">
          Promo not found
        </Typography>
        <Button onClick={handleBack} startIcon={<ArrowBackIcon />}>
          Back to campaign
        </Button>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Button
          className={classes.backButton}
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
          variant="outlined"
        >
          Back
        </Button>
        <Typography variant="h4" style={{ flexGrow: 1 }}>
          {promo.promoCode}
        </Typography>
        {!promo.lockStatus?.locked ||
        (promo.lockStatus?.locked && promo.lockStatus?.email !== userEmail) ? (
          <Button variant="contained" color="primary" onClick={handleEditPromo}>
            Edit
          </Button>
        ) : null}
        {promo.lockStatus?.locked && promo.lockStatus?.email === userEmail && (
          <Button variant="outlined" color="secondary" onClick={handleUnlockPromo}>
            Cancel Edit
          </Button>
        )}
      </div>
      <PromoEditor
        promo={promo}
        isEditing={isEditing}
        onSave={handleSavePromo}
        onCancel={handleCancelEdit}
        onLock={handleLockPromo}
        userEmail={userEmail}
      />
    </div>
  );
};

export default PromoEditorPage;
