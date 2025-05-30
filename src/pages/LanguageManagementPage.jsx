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

  useEffect(() => {
    // Fetch available languages from the backend
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/languages`);
      const data = await response.json();
      setLanguages(data);
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
    setError('');
  };

  const handleSaveLanguage = async () => {
    try {
      // Validate the language code
      if (!newLanguage.code || !newLanguage.name) {
        setError('Language code and name are required');
        return;
      }

      // Send the new language to the backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/languages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLanguage),
      });

      if (!response.ok) {
        throw new Error('Failed to add language');
      }

      // Refresh the languages list
      await fetchLanguages();
      handleCloseModal();
    } catch (error) {
      console.error('Error adding language:', error);
      setError('Failed to add language');
    }
  };

  const handleDeleteLanguage = async (code) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/languages/${code}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete language');
      }

      // Refresh the languages list
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
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        backgroundColor: '#fefefe',
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          width: 'calc(100%)',
          maxWidth: '1600px',
          marginLeft: '260px',
          pt: 2,
          px: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          {t('common.languageManagement')}
        </Typography>

        {/* Current Language */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('common.currentLanguage')}
            </Typography>
            <Typography>
              {languages.find(lang => lang.code === i18n.language)?.name || 'English'} ({i18n.language})
            </Typography>
          </CardContent>
        </Card>

        {/* Available Languages */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {t('common.availableLanguages')}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddLanguage}
            >
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
                          disabled={language.code === 'en'} // Prevent deleting English
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

        {/* Add Language Modal */}
        <Dialog
          open={isAddModalOpen}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
        >
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
                value={JSON.stringify(newLanguage.translations, null, 2)}
                onChange={(e) => {
                  try {
                    const translations = JSON.parse(e.target.value);
                    setNewLanguage({ ...newLanguage, translations });
                  } catch (error) {
                    // Invalid JSON, don't update
                  }
                }}
                placeholder={t('common.pasteTranslations')}
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