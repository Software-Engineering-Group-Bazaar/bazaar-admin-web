import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const LanguageManagementPage = () => {
  const { t, i18n } = useTranslation();
  const [languages, setLanguages] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLanguage, setNewLanguage] = useState({
    code: '',
    name: '',
    translations: {},
  });
  const [error, setError] = useState('');
  const [translationsText, setTranslationsText] = useState('');
  const [jsonError, setJsonError] = useState('');

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/translations/languages`);
      const data = await response.json();
      setLanguages(data);
      const masterkeys = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/translations/master-keys`);
      const keydata = await masterkeys.json();
      console.log(keydata);
      let obj = "{\n";
      for (let index = 0; index < keydata.length; index++) {
        obj += `\t "${keydata[index]}": "",\n`
      }
      obj += "}"
      setTranslationsText(obj);
    } catch (error) {
      console.error('Failed to fetch languages:', error);
      setError('Failed to load languages');
    }
  };

  const handleAddLanguage = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setNewLanguage({
      code: '',
      name: '',
      translations: {},
    });
    setTranslationsText('');
    setJsonError('');
    setError('');
  };

  const handleSaveLanguage = async () => {
    try {
      if (!newLanguage.code || !newLanguage.name) {
        setError('Language code and name are required');
        return;
      }

      if (jsonError) {
        setError('Fix translation JSON errors before saving.');
        return;
      }
      console.log(JSON.stringify(newLanguage));
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/translations/languages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLanguage),
      });

      if (!response.ok) {
        throw new Error('Failed to add language');
      }

      await fetchLanguages();
      handleCloseModal();
    } catch (error) {
      console.error('Error adding language:', error);
      setError('Failed to add language');
    }
  };

  const handleDeleteLanguage = async (code) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/translations/languages/${code}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete language');
      }

      await fetchLanguages();
    } catch (error) {
      console.error('Error deleting language:', error);
      setError('Failed to delete language');
    }
  };

  const handleChangeLanguage = (code) => {
    i18n.changeLanguage(code);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', backgroundColor: '#fefefe', minHeight: '100vh' }}>
      <Box sx={{ width: 'calc(100%)', maxWidth: '1600px', marginLeft: '260px', pt: 2, px: 2 }}>
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          {t('common.languageManagement')}
        </Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('common.currentLanguage')}
            </Typography>
            <Typography>
              {
                languages.find(lang => lang.code === i18n.language)?.name
                ? `${languages.find(lang => lang.code === i18n.language).name} (${i18n.language})`
                : `English (${i18n.language})`
              }
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">{t('common.availableLanguages')}</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddLanguage}>
              {t('common.addLanguage')}
            </Button>
          </Box>

          <Grid container spacing={2}>
            {languages.map((language) => (
              <Grid item xs={12} sm={6} md={4} key={language.code}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">
                        {language.name} ({language.code})
                      </Typography>
                      <Box>
                        <IconButton
                          color="primary"
                          onClick={() => handleChangeLanguage(language.code)}
                          disabled={language.code === i18n.language}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteLanguage(language.code)}
                          disabled={language.code === 'en'}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Dialog open={isAddModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
          <DialogTitle>{t('common.addNewLanguage')}</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label={t('common.languageCode')}
                value={newLanguage.code}
                onChange={(e) => setNewLanguage({ ...newLanguage, code: e.target.value })}
                placeholder="e.g., fr, de, es"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label={t('common.languageName')}
                value={newLanguage.name}
                onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
                placeholder="e.g., French, German, Spanish"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label={t('common.translations')}
                multiline
                rows={10}
                value={translationsText}
                onChange={(e) => {
                  const text = e.target.value;
                  setTranslationsText(text);
                  try {
                    const parsed = JSON.parse(text);
                    setNewLanguage({ ...newLanguage, translations: parsed });
                    setJsonError('');
                  } catch {
                    setJsonError('Invalid JSON');
                  }
                }}
                placeholder={t('common.pasteTranslations')}
                error={!!jsonError}
                helperText={jsonError || t('common.translationJsonHint')}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>{t('common.cancel')}</Button>
            <Button onClick={handleSaveLanguage} variant="contained">
              {t('common.saveLanguage')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default LanguageManagementPage;
