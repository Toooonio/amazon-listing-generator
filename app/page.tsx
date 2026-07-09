"use client";

import { useState, useCallback } from "react";
import { FileText } from "lucide-react";
import BrandInput from "@/components/BrandInput";
import LanguageSelector from "@/components/LanguageSelector";
import OutputModeSelector from "@/components/OutputModeSelector";
import AdvancedSettingsPanel from "@/components/AdvancedSettings";
import ProductInputTextarea from "@/components/ProductInputTextarea";
import GenerateButton from "@/components/GenerateButton";
import OutputCard from "@/components/OutputCard";
import BulletOutput from "@/components/BulletOutput";
import ComplianceWarning from "@/components/ComplianceWarning";
import { OutputMode, AdvancedSettings, DEFAULT_SETTINGS, GeneratedOutput } from "@/types";
import { generateAmazonCopy, GenerateResult } from "@/lib/generator";
import { detectLanguage } from "@/lib/language";
import { validateInput } from "@/lib/validators";

export default function HomePage() {
  const [brand, setBrand] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [mode, setMode] = useState<OutputMode>("all");
  const [settings, setSettings] = useState<AdvancedSettings>(DEFAULT_SETTINGS);
  const [productText, setProductText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [autoDetectedLang, setAutoDetectedLang] = useState<string | undefined>(undefined);

  const handleTextChange = useCallback((text: string) => {
    setProductText(text);
    if (text.trim().length > 20) {
      setAutoDetectedLang(detectLanguage(text));
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    const inputValidation = validateInput(productText, brand);
    if (!inputValidation.valid) {
      setResult({
        output: {},
        warnings: inputValidation.errors,
        validationErrors: inputValidation.errors,
        complianceWarnings: [],
      });
      return;
    }

    setLoading(true);

    // Use setTimeout to allow UI to update before computation
      try {
        const genResult = await generateAmazonCopy({
          rawText: productText,
          brand: brand.trim(),
          targetLanguage,
          mode,
          settings,
        });
        setResult(genResult);
      } catch (err) {
        setResult({
          output: {},
          warnings: ["生成过程中出现错误，请重试。"],
          validationErrors: [],
          complianceWarnings: [],
        });
      } finally {
        setLoading(false);
      }
  }, [productText, brand, targetLanguage, mode, settings]);

  const regenerateTitle = useCallback(async () => {
    if (!productText || !brand) return;
        const genResult = await generateAmazonCopy({
      rawText: productText,
      brand: brand.trim(),
      targetLanguage,
      mode: "title-highlights",
      settings,
    });
    setResult((prev) =>
      prev
        ? {
            ...prev,
            output: { ...prev.output, title: genResult.output.title, highlights: genResult.output.highlights },
          }
        : prev
    );
  }, [productText, brand, targetLanguage, settings]);

  const regenerateHighlights = useCallback(async () => {
    if (!productText || !brand || !result?.output.title) return;
        const genResult = await generateAmazonCopy({
      rawText: productText,
      brand: brand.trim(),
      targetLanguage,
      mode: "title-highlights",
      settings,
    });
    setResult((prev) =>
      prev
        ? { ...prev, output: { ...prev.output, highlights: genResult.output.highlights } }
        : prev
    );
  }, [productText, brand, targetLanguage, settings, result]);

  const regenerateBullets = useCallback(async () => {
    if (!productText || !brand) return;
        const genResult = await generateAmazonCopy({
      rawText: productText,
      brand: brand.trim(),
      targetLanguage,
      mode: "bullets",
      settings,
    });
    setResult((prev) =>
      prev ? { ...prev, output: { ...prev.output, bullets: genResult.output.bullets } } : prev
    );
  }, [productText, brand, targetLanguage, settings]);

  const regenerateDescription = useCallback(async () => {
    if (!productText || !brand) return;
        const genResult = await generateAmazonCopy({
      rawText: productText,
      brand: brand.trim(),
      targetLanguage,
      mode: "description",
      settings,
    });
    setResult((prev) =>
      prev ? { ...prev, output: { ...prev.output, description: genResult.output.description } } : prev
    );
  }, [productText, brand, targetLanguage, settings]);

  const output = result?.output || {};
  const hasTitle = !!(mode === "title-highlights" || mode === "all") && !!output.title;
  const hasHighlights = !!(mode === "title-highlights" || mode === "all") && !!output.highlights;
  const hasBullets = !!(mode === "bullets" || mode === "all") && !!output.bullets;
  const hasDescription = !!(mode === "description" || mode === "all") && !!output.description;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <FileText size={32} style={{ color: "var(--accent)" }} />
            <h1 className="text-2xl font-bold">亚马逊 Listing 生成器</h1>
          </div>
          <p style={{ color: "var(--text-secondary)" }} className="max-w-xl mx-auto">
            Enter your raw product information and automatically generate Amazon-compliant
            titles, highlights, bullet points, and descriptions.
          </p>
        </div>

        {/* Main layout */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left: Input area */}
          <div className="space-y-5 lg:col-span-2">
            <BrandInput value={brand} onChange={setBrand} />

            <LanguageSelector
              value={targetLanguage}
              onChange={setTargetLanguage}
              autoDetected={autoDetectedLang}
            />

            <OutputModeSelector value={mode} onChange={setMode} />

            <AdvancedSettingsPanel settings={settings} onChange={setSettings} />

            <ProductInputTextarea value={productText} onChange={handleTextChange} />

            <GenerateButton
              onClick={handleGenerate}
              loading={loading}
              disabled={!productText.trim() || !brand.trim()}
            />
          </div>

          {/* Right: Output area */}
          <div className="space-y-4 lg:col-span-3">
            <h2 className="text-lg font-semibold">生成结果</h2>

            {!result && !loading && (
              <div
                className="rounded-lg p-8 text-center border border-dashed"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-secondary)",
                }}
              >
                <FileText size={40} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">
                  Enter your brand name, product information, select output mode, and click
                  &quot;Generate Amazon Listing&quot; to get started.
                </p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div
                  className="inline-block w-8 h-8 border-2 rounded-full animate-spin"
                  style={{
                    borderColor: "var(--border)",
                    borderTopColor: "var(--accent)",
                  }}
                />
                <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                  正在生成亚马逊文案...
                </p>
              </div>
            )}

            {result && result.validationErrors.length > 0 && !loading && (
              <div
                className="rounded-lg p-3 text-sm"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "var(--error)",
                }}
              >
                {result.validationErrors.map((e, i) => (
                  <p key={i}>{e}</p>
                ))}
              </div>
            )}

            {result && result.warnings.length > 0 && !loading && (
              <div
                className="rounded-lg p-3 text-sm"
                style={{
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.3)",
                  color: "var(--warning)",
                }}
              >
                {result.warnings.map((w, i) => (
                  <p key={i}>{w}</p>
                ))}
              </div>
            )}

            {/* Compliance warnings */}
            {result && result.complianceWarnings.length > 0 && !loading && (
              <ComplianceWarning warnings={result.complianceWarnings} />
            )}

            {/* Output cards */}
            {!loading && (
              <div className="space-y-4">
                {hasTitle && output.title && (
                  <OutputCard
                    label="标题"
                    content={output.title}
                    maxLength={settings.titleMaxLength}
                    onRegenerate={regenerateTitle}
                  />
                )}

                {hasHighlights && output.highlights && (
                  <OutputCard
                    label="亮点"
                    content={output.highlights}
                    maxLength={settings.highlightMaxLength}
                    onRegenerate={regenerateHighlights}
                  />
                )}

                {hasBullets && output.bullets && output.bullets.length > 0 && (
                  <BulletOutput
                    bullets={output.bullets}
                    onRegenerateAll={regenerateBullets}
                  />
                )}

                {hasDescription && output.description && (
                  <OutputCard
                    label="产品描述"
                    content={output.description}
                    onRegenerate={regenerateDescription}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t text-center text-xs" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
          <p>亚马逊 Listing 生成器 - A general-purpose tool for creating Amazon-compliant product copy.</p>
          <p className="mt-1">支持多语言、合规过滤和去重优化。</p>
        </div>
      </div>
    </div>
  );
}
