import 'package:flutter/material.dart';

import 'package:omi/backend/preferences.dart';
import 'package:omi/providers/capture_provider.dart';
import 'package:omi/services/ai_interjection_service.dart';

class AiInterjectionProvider extends ChangeNotifier {
  CaptureProvider? _captureProvider;
  bool _enabled = false;
  bool _isInterjecting = false;
  String _lastTranscript = '';

  bool get enabled => _enabled;
  bool get isInterjecting => _isInterjecting;

  void init(CaptureProvider captureProvider) {
    _captureProvider = captureProvider;
    _enabled = SharedPreferencesUtil().aiInterjectionEnabled;
    captureProvider.addListener(_onCaptureChanged);
  }

  void setEnabled(bool value) {
    _enabled = value;
    SharedPreferencesUtil().aiInterjectionEnabled = value;
    if (value) {
      AiInterjectionService.instance.connect();
    } else {
      AiInterjectionService.instance.disconnect();
    }
    notifyListeners();
  }

  void _onCaptureChanged() {
    if (!_enabled) return;
    if (_captureProvider == null) return;

    final segments = _captureProvider!.segments;
    if (segments.isEmpty) return;

    final transcript = segments.map((s) => s.text).join(' ');
    if (transcript == _lastTranscript) return;
    _lastTranscript = transcript;

    _isInterjecting = AiInterjectionService.instance.isQuerying;
    AiInterjectionService.instance.onTranscriptChanged(transcript);
    notifyListeners();
  }

  @override
  void dispose() {
    _captureProvider?.removeListener(_onCaptureChanged);
    super.dispose();
  }
}
