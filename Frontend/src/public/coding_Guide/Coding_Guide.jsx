import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import { Copy } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useParentAPI } from "../Home/context/Parent_API_Provider";
import Linkify from "react-linkify";
import "./assets/css/Coding_Guide.css";

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dusqlukhy/";

const Coding_Guide = () => {
  const { topicID } = useParams();
  const { baseData, loadingBase, fetchTopicDetail, fetchBackendSteps, fetchBackendImages } = useParentAPI();

  const [topic, setTopic] = useState(null);
  const [loadingTopic, setLoadingTopic] = useState(true);
  const [copiedStep, setCopiedStep] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);

  // -------------------- Singleton guard for fetch per topic --------------------
  const fetchingTopics = useRef({});

  // -------------------- Persistent cache helpers --------------------
  const getCachedItem = (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  };

  const setCachedItem = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {}
  };

  // -------------------- Flatten topics from baseData --------------------
  const getAllTopics = useCallback(() => {
    return baseData?.categories?.flatMap(cat => cat.sections || [])
      ?.flatMap(sec => sec.languages || [])
      ?.flatMap(lang => lang.topics || []) || [];
  }, [baseData]);

  // -------------------- Load topic, steps, images --------------------
  const loadTopicData = useCallback(async () => {
    if (fetchingTopics.current[topicID]) return; // already fetching
    fetchingTopics.current[topicID] = true;

    setLoadingTopic(true);

    const cacheTopicKey = `topicDetail_${topicID}`;
    const cacheStepsKey = `backendSteps_${topicID}`;
    const cacheImagesKey = `backendImages_${topicID}`;

    // 1️⃣ Try baseData first
    let foundTopic = getAllTopics().find(t => String(t.id) === String(topicID));

    // 2️⃣ Then persistent cache
    if (!foundTopic) foundTopic = getCachedItem(cacheTopicKey);

    // 3️⃣ If still not found, fetch from API
    if (!foundTopic) {
      foundTopic = await fetchTopicDetail(topicID);
      if (foundTopic) setCachedItem(cacheTopicKey, foundTopic);
    }

    if (!foundTopic) {
      setTopic(null);
      setLoadingTopic(false);
      fetchingTopics.current[topicID] = false;
      return;
    }

    // -------------------- Backend steps --------------------
    let steps = getCachedItem(cacheStepsKey);
    if (!steps) {
      steps = await fetchBackendSteps(foundTopic.id);
      setCachedItem(cacheStepsKey, steps);
    }

    // -------------------- Backend images --------------------
    let images = getCachedItem(cacheImagesKey);
    if (!images) {
      images = await fetchBackendImages(foundTopic.id);
      setCachedItem(cacheImagesKey, images);
    }

    setTopic({ ...foundTopic, steps, images });
    setLoadingTopic(false);
    fetchingTopics.current[topicID] = false;
  }, [topicID, getAllTopics, fetchTopicDetail, fetchBackendSteps, fetchBackendImages]);

  // -------------------- Load topic when baseData or topicID changes --------------------
  useEffect(() => {
    if (!loadingBase) loadTopicData();
  }, [loadingBase, topicID, loadTopicData]);

  // -------------------- Highlight code --------------------
  useEffect(() => {
    if (topic?.steps?.length) {
      const timer = setTimeout(() => Prism.highlightAll(), 50);
      return () => clearTimeout(timer);
    }
  }, [topic]);

  const getPrismLang = (lang) => {
    if (!lang) return "javascript";
    const map = { js: "javascript", javascript: "javascript", py: "python", python: "python" };
    return map[lang.toLowerCase()] || lang.toLowerCase();
  };

  const handleCopy = (code, stepId) => {
    navigator.clipboard.writeText(code);
    setCopiedStep(stepId);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  // -------------------- Render skeleton --------------------
  if (loadingBase || loadingTopic) {
    return (
      <div className="container py-5">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="card mb-4">
            <div className="card-body">
              <Skeleton height={30} width="50%" style={{ marginBottom: 10 }} />
              <Skeleton count={3} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="text-center py-5">
        ❌ Topic not found or not loaded yet.
        <br />
        <Link to="/" className="btn btn-outline-danger mt-3">
          ← Back to Home
        </Link>
      </div>
    );
  }

  // -------------------- Render --------------------
  return (
    <div className="container py-3" style={{ minHeight: "100vh" }}>
      <h2 className="my-3 fw-bold text-center pb-4 text-info">{topic.name}</h2>
      <div className="row">
        {/* Steps */}
        <div className="col-lg-7 mb-4 mb-lg-0 code-steps px-0">
          <h4 className="mb-2 mt-4 fw-semibold text-center"><small>- Steps -</small></h4>
          {topic.steps?.length ? (
            topic.steps.map((step) => {
              const prismLang = getPrismLang(step.step_language);
              return (
                <div key={step.id} className="card mb-4 shadow-sm border-0 rounded-4">
                  <div className="card-body backend-card">
                    <h5 className="fw-bold text-warning mb-0 mt-3 px-1">
                      Step {step.step_number}: <small>{step.step_file_name}</small>
                    </h5>
                    {step.step_description && (
                      <p className="text-muted m-0 text-content py-2 px-2">
                        <Linkify
                          componentDecorator={(href, text, key) => (
                            <a href={href} key={key} target="_blank" rel="noopener noreferrer"
                               style={{ color: "#1e90ff", textDecoration: "underline" }}>
                              {text}
                            </a>
                          )}
                        >
                          {step.step_description}
                        </Linkify>
                      </p>
                    )}
                    {step.step_source_code && (
                      <div className="code-container position-relative">
                        <button
                          className="copy-btn"
                          onClick={() => handleCopy(step.step_source_code, step.id)}
                        >
                          {copiedStep === step.id ? "✅ Copied!" : <Copy size={18} />}
                        </button>
                        <pre className={`language-${prismLang} code-block`}>
                          <code className={`language-${prismLang}`}>
                            {step.step_source_code}
                          </code>
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-muted py-3">Steps will be uploaded soon...</p>
          )}
        </div>

        {/* Images */}
        {topic.images?.length ? (
          <div className="col-lg-5 px-4">
            <h4 className="mb-2 mt-3 fw-semibold text-center"><small>- File Format -</small></h4>
            {topic.images.map((img) => (
              <div key={img.id} className="card shadow-sm mb-3 rounded-4 overflow-hidden">
                <img
                  src={`${CLOUDINARY_BASE_URL}${img.image}`}
                  alt={`Backend step ${img.id}`}
                  className="img-fluid preview-img"
                  onClick={() => setZoomedImage(`${CLOUDINARY_BASE_URL}${img.image}`)}
                  loading="lazy"
                />
              </div>
            ))}
            {zoomedImage && (
              <div className="image-popup" onClick={() => setZoomedImage(null)}>
                <img src={zoomedImage} alt="Full preview" />
              </div>
            )}
          </div>
        ) : (
          <div className="col-lg-5 px-4">
            <p className="text-center text-muted mt-4">No images uploaded yet...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coding_Guide;
