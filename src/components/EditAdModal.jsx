    import {
        Dialog,
        DialogActions,
        DialogContent,
        DialogTitle,
        TextField,
        Button,
        FormControlLabel,
        Switch,
    } from '@mui/material';
    import { useState, useEffect } from 'react';
    
    const EditAdModal = ({ open, onClose, ad, onSave }) => {
        const [description, setDescription] = useState("");
        const [sellerId, setSellerId] = useState("");
        const [productLink, setProductLink] = useState("");
        const [storeLink, setStoreLink] = useState("");
        const [isActive, setIsActive] = useState(true);
    
        useEffect(() => {
        setDescription(ad?.AdData?.[0]?.Description || "");
        setSellerId(ad?.sellerId || "");
        setProductLink(ad?.AdData?.[0]?.ProductLink || "");
        setStoreLink(ad?.AdData?.[0]?.StoreLink || "");
        setIsActive(ad?.isActive || false);
        }, [ad]);
    
        const handleSave = () => {
        const updatedAd = {
            ...ad,
            sellerId,
            isActive,
            AdData: [
            {
                ...ad.AdData[0],
                Description: description,
                ProductLink: productLink,
                StoreLink: storeLink,
            },
            ],
        };
        onSave(updatedAd);
        onClose();
        };
    
        return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
            sx: {
                borderRadius: 3,
                p: 2,
                boxShadow: 10,
            },
            }}
        >
            <DialogTitle
            sx={{
                fontWeight: 600,
                fontSize: 20,
                color: '#1e293b',
                pb: 0.5,
            }}
            >
            ✏️ Edit Advertisement
            </DialogTitle>
    
            <DialogContent sx={{ pt: 1 }}>
            <TextField
                label="Seller ID"
                fullWidth
                margin="dense"
                value={sellerId}
                onChange={(e) => setSellerId(e.target.value)}
                variant="outlined"
            />
            <TextField
                label="Description"
                fullWidth
                margin="dense"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
            />
            <TextField
                label="Product Link"
                fullWidth
                margin="dense"
                value={productLink}
                onChange={(e) => setProductLink(e.target.value)}
                variant="outlined"
            />
            <TextField
                label="Store Link"
                fullWidth
                margin="dense"
                value={storeLink}
                onChange={(e) => setStoreLink(e.target.value)}
                variant="outlined"
            />
            <FormControlLabel
                sx={{ mt: 1 }}
                control={
                <Switch
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    color="success"
                />
                }
                label="Active Status"
            />
            </DialogContent>
    
            <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={onClose} sx={{ textTransform: 'none' }}>
                Cancel
            </Button>
            <Button
                onClick={handleSave}
                variant="contained"
                sx={{
                backgroundColor: '#6366f1',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#4f46e5' },
                }}
            >
                Save
            </Button>
            </DialogActions>
        </Dialog>
        );
    };
    
    export default EditAdModal;
    