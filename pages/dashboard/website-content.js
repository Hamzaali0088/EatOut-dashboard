import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { getWebsiteSettings, updateWebsiteSettings } from "../../lib/apiClient";
import { Plus, Trash2, Save, Image as ImageIcon } from "lucide-react";

export default function WebsiteContentPage() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await getWebsiteSettings();
      // Initialize default structures if they don't exist
      if (!data.heroSlides) data.heroSlides = [];
      if (!data.socialMedia) data.socialMedia = {};
      if (!data.openingHours) data.openingHours = {};
      if (!data.themeColors) data.themeColors = { primary: '#EF4444', secondary: '#FFA500' };
      setSettings(data);
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    try {
      await updateWebsiteSettings(settings);
      alert("Website content saved successfully!");
    } catch (err) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  const addHeroSlide = () => {
    setSettings(prev => ({
      ...prev,
      heroSlides: [...(prev.heroSlides || []), {
        title: "",
        subtitle: "",
        imageUrl: "",
        buttonText: "Order Now",
        buttonLink: "",
        isActive: true
      }]
    }));
  };

  const updateHeroSlide = (index, field, value) => {
    setSettings(prev => ({
      ...prev,
      heroSlides: prev.heroSlides.map((slide, i) => 
        i === index ? { ...slide, [field]: value } : slide
      )
    }));
  };

  const removeHeroSlide = (index) => {
    setSettings(prev => ({
      ...prev,
      heroSlides: prev.heroSlides.filter((_, i) => i !== index)
    }));
  };

  if (!settings) {
    return (
      <AdminLayout title="Website Content">
        <p className="text-sm text-gray-600 dark:text-neutral-400">Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Website Content">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("hero")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "hero"
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300"
            }`}
          >
            Hero Slides
          </button>
          <button
            onClick={() => setActiveTab("social")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "social"
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300"
            }`}
          >
            Social Media
          </button>
          <button
            onClick={() => setActiveTab("hours")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "hours"
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300"
            }`}
          >
            Opening Hours
          </button>
          <button
            onClick={() => setActiveTab("theme")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "theme"
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300"
            }`}
          >
            Theme Colors
          </button>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Hero Slides Tab */}
      {activeTab === "hero" && (
        <Card title="Hero Slides" description="Manage homepage banner carousel">
          <div className="space-y-4">
            {settings.heroSlides?.map((slide, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Slide {index + 1}</h3>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-neutral-400">
                      <input
                        type="checkbox"
                        checked={slide.isActive}
                        onChange={(e) => updateHeroSlide(index, 'isActive', e.target.checked)}
                        className="rounded"
                      />
                      Active
                    </label>
                    <button
                      onClick={() => removeHeroSlide(index)}
                      className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Title"
                    value={slide.title || ''}
                    onChange={(e) => updateHeroSlide(index, 'title', e.target.value)}
                    className="px-3 py-2 rounded-lg bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-700 text-sm text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Subtitle"
                    value={slide.subtitle || ''}
                    onChange={(e) => updateHeroSlide(index, 'subtitle', e.target.value)}
                    className="px-3 py-2 rounded-lg bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-700 text-sm text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={slide.imageUrl || ''}
                    onChange={(e) => updateHeroSlide(index, 'imageUrl', e.target.value)}
                    className="px-3 py-2 rounded-lg bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-700 text-sm text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Button Text"
                    value={slide.buttonText || ''}
                    onChange={(e) => updateHeroSlide(index, 'buttonText', e.target.value)}
                    className="px-3 py-2 rounded-lg bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-700 text-sm text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addHeroSlide}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-700 text-gray-600 dark:text-neutral-400 hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Hero Slide
            </button>
          </div>
        </Card>
      )}

      {/* Social Media Tab */}
      {activeTab === "social" && (
        <Card title="Social Media Links" description="Add your social media profiles">
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-neutral-300">Facebook</label>
              <input
                type="url"
                placeholder="https://facebook.com/yourpage"
                value={settings.socialMedia?.facebook || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                }))}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-sm text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-neutral-300">Instagram</label>
              <input
                type="url"
                placeholder="https://instagram.com/yourpage"
                value={settings.socialMedia?.instagram || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                }))}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-sm text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-neutral-300">Twitter</label>
              <input
                type="url"
                placeholder="https://twitter.com/yourpage"
                value={settings.socialMedia?.twitter || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                }))}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-sm text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-neutral-300">YouTube</label>
              <input
                type="url"
                placeholder="https://youtube.com/yourchannel"
                value={settings.socialMedia?.youtube || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  socialMedia: { ...prev.socialMedia, youtube: e.target.value }
                }))}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-sm text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Opening Hours Tab */}
      {activeTab === "hours" && (
        <Card title="Opening Hours" description="Set your restaurant opening hours">
          <div className="space-y-3">
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
              <div key={day} className="grid grid-cols-[120px_1fr] gap-3 items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300 capitalize">{day}</label>
                <input
                  type="text"
                  placeholder="e.g., 9:00 AM - 10:00 PM"
                  value={settings.openingHours?.[day] || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    openingHours: { ...prev.openingHours, [day]: e.target.value }
                  }))}
                  className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-sm text-gray-900 dark:text-white"
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Theme Colors Tab */}
      {activeTab === "theme" && (
        <Card title="Theme Colors" description="Customize your website colors">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Primary Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.themeColors?.primary || '#EF4444'}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    themeColors: { ...prev.themeColors, primary: e.target.value }
                  }))}
                  className="h-10 w-20 rounded border border-gray-300 dark:border-neutral-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.themeColors?.primary || '#EF4444'}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    themeColors: { ...prev.themeColors, primary: e.target.value }
                  }))}
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-sm text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Secondary Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.themeColors?.secondary || '#FFA500'}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    themeColors: { ...prev.themeColors, secondary: e.target.value }
                  }))}
                  className="h-10 w-20 rounded border border-gray-300 dark:border-neutral-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.themeColors?.secondary || '#FFA500'}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    themeColors: { ...prev.themeColors, secondary: e.target.value }
                  }))}
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-sm text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </Card>
      )}
    </AdminLayout>
  );
}
