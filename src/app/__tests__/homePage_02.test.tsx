import { render, screen } from "@testing-library/react";
import Home from "../page";
import { useSearchParams, useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

describe("Home Page - Query Diagnosis Integration", () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });
  });

  it("openDiagnosis=true のクエリパラメータが存在する場合にモーダルが自動的に開くこと", () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("openDiagnosis=true"),
    );

    render(<Home />);

    // URLのクエリパラメータを破棄・置換する処理が走っていることを確認
    expect(mockReplace).toHaveBeenCalledWith("/", { scroll: false });
  });

  it("クエリパラメータが存在しない場合は自動クリーンアップ処理が実行されないこと", () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(""));

    render(<Home />);

    expect(mockReplace).not.toHaveBeenCalled();
  });
});
