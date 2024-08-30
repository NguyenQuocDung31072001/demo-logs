import Axios, {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
  CreateAxiosDefaults,
} from 'axios';
import { Observable } from 'rxjs';

type TAxiosInstance = Omit<
  AxiosInstance,
  'head' | 'get' | 'post' | 'put' | 'patch' | 'delete' | 'request'
> & {
  head<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>>;

  get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>>;

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>>;

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>>;

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>>;

  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>>;

  request<T = any>(config: AxiosRequestConfig): Observable<AxiosResponse<T>>;
};

export abstract class HttpService {
  protected httpService: TAxiosInstance;

  constructor(config?: CreateAxiosDefaults | (() => CreateAxiosDefaults)) {
    let cf: any = config;

    if (typeof config === 'function') {
      cf = config();
    }

    const {
      head: _head,
      get: _get,
      post: _post,
      put: _put,
      patch: _patch,
      delete: _delete,
      request: _request,
      ...httpService
    } = Axios.create(cf);

    this.httpService = httpService as TAxiosInstance;

    this.httpService.head = <T = any>(
      url: string,
      config?: AxiosRequestConfig,
    ) => this.makeObservable<T>(_head, url, config);

    this.httpService.get = <T = any>(
      url: string,
      config?: AxiosRequestConfig,
    ) => this.makeObservable<T>(_get, url, config);

    this.httpService.post = <T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
    ) => this.makeObservable<T>(_post, url, data, config);

    this.httpService.put = <T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
    ) => this.makeObservable<T>(_put, url, data, config);

    this.httpService.patch = <T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
    ) => this.makeObservable<T>(_patch, url, data, config);

    this.httpService.delete = <T = any>(
      url: string,
      config?: AxiosRequestConfig,
    ) => this.makeObservable<T>(_delete, url, config);

    this.httpService.request = <T = any>(config: AxiosRequestConfig) =>
      this.makeObservable<T>(_request, config);
  }

  protected makeObservable<T>(
    axios: (...args: any[]) => AxiosPromise<T>,
    ...args: any[]
  ) {
    return new Observable<AxiosResponse<T>>((subscriber) => {
      const config: AxiosRequestConfig = { ...(args[args.length - 1] || {}) };

      let cancelSource: CancelTokenSource;
      if (!config.cancelToken) {
        cancelSource = Axios.CancelToken.source();
        config.cancelToken = cancelSource.token;
      }

      axios(...args)
        .then((res) => {
          subscriber.next(res);
          subscriber.complete();
        })
        .catch((err) => {
          subscriber.error(err);
        });

      return () => {
        if (config.responseType === 'stream') {
          return;
        }

        if (cancelSource) {
          cancelSource.cancel();
        }
      };
    });
  }
}
